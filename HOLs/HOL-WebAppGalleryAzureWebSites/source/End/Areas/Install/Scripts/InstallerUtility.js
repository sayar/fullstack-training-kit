/// <reference path="../../Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Installer");

(function ($) {

    Umbraco.Installer.InstallerUtility = function() {

        //options set at init
        var _opts;
        
        //view model for knockout
        var viewModel = {
            status : ko.observable("restarting"),
            dbInstallRetryCount: ko.observable(0),
            appRestartRetryCount: ko.observable(0),
            installPercentage: ko.observable(0),
            statusMsg: ko.observable(""),
            ysod : ko.observable("")
        };

        //callback for the install progress bar
        function installProgressCheck(onlyCheck) {	        
            if (viewModel.dbInstallRetryCount() >= 100){
                if (viewModel.status() != "error") {
                    viewModel.statusMsg("The maximum retry count has been reached, please manually refresh the page.");
                }   
                return;             
            }
           
            if (viewModel.installPercentage() >= 100) return;

            $.ajax({
                data : "{'onlyCheck': '" + onlyCheck + "'}",
                type: "POST",
                url: _opts.getProgressUrl, 
                error: function(jqXHR, textStatus, errorThrown) {
                      viewModel.status("error");
                      //get text inside body
                      var errorHtml = jqXHR.responseText.split("<body bgcolor=\"white\">")[1].split("</body>")[0];
                      viewModel.statusMsg("A server error occurred: \n\n Exception/Stack Trace: \n\n");
                      viewModel.ysod(errorHtml);
                },
                success: function(r) {                    
                    if (r) {
                        if(r.fail != null)
                        {
                           $(".hold").hide();
                           viewModel.ysod(r.message);
                        }
                        else
                        {
                            viewModel.statusMsg(r.message);
                            //set the %
                            if (viewModel.installPercentage() < r.percentage) {
                                viewModel.installPercentage(r.percentage);    
                                                        
                                //the first returned poll, will return 40, so lets slowly increment that until its 100, we'll make this look slightly more random by doing it on a timeout
                                var updateBar = function() {
                                    if (viewModel.installPercentage() < 100) {
                                        viewModel.installPercentage(viewModel.installPercentage() + Math.randomRange(0, 2));
                                        Umbraco.Installer.updateProgressBar(viewModel.installPercentage(), "#progressBarInstall");
                                        //recurse randomly
                                        setTimeout(updateBar, Math.randomRange(1000, 2000));
                                    }
                                };
                                updateBar();                            
                            }
                            if (viewModel.installPercentage() >= 100) {
                                viewModel.installPercentage(100);    
                                Umbraco.Installer.updateProgressBar(100, "#progressBarInstall");
                                $(".btn-box").show();
                            }  
                        }       
                    }                    
                }
            });

            //increment
            viewModel.dbInstallRetryCount(viewModel.dbInstallRetryCount() + 1);

            //update the prog bar... (we'll ony go a max of 40... since thats the # returned from the 2nd poll), we'll make this look slightly more random by doing it on a timeout
            if (viewModel.installPercentage() < 40) {
                setTimeout(function() {
                    if (viewModel.installPercentage() < 40) {
                        Umbraco.Installer.updateProgressBar(viewModel.dbInstallRetryCount(), "#progressBarInstall");
                        viewModel.installPercentage(viewModel.dbInstallRetryCount());
                    }                    
                }, Math.randomRange(1, 400));
            }     

            //recurse!
            setTimeout(function() { installProgressCheck(true); }, 1000);
	    }

        //send the ajax request to restart the app pool and to check if its completed
        function appRestart(statusCheck) {
            if (viewModel.appRestartRetryCount() >= 100){
                if (viewModel.status() != "error") {
                    viewModel.statusMsg("The maximum retry count has been reached, please manually refresh the page.");
                }   
                return;             
            }
            if (viewModel.status() == "restarted") return;
            if (statusCheck != "wait") {
                //thsi will only fire twice, once to do the restart and once to check
                $.ajax({
                    data : "{'onlyCheck': '" + statusCheck + "'}",
                    type: "POST",
                    url: _opts.appRestartUrl, 
                    error: function(jqXHR, textStatus, errorThrown) {
                        if (viewModel.appRestartRetryCount() >= 100 && viewModel.status() != "error") {
                            viewModel.status("error");
                            //get text inside body
                            var errorHtml = jqXHR.responseText.split("<body bgcolor=\"white\">")[1].split("</body>")[0];
                            viewModel.statusMsg("A server error occurred: \n\n Exception/Stack Trace: \n\n");
                            viewModel.ysod(errorHtml);
                        }
                    },
                    success: function(r) {                    
                        if (r) {
                            //update the status
                            viewModel.status(r.status);
                            if (r.status == "restarted") {
                                //now that its successful, lets query for install status
                                setTimeout(function() {
                                    installProgressCheck(false);                                
                                }, 1500);
                            }
                        }                    
                    }
                });
            }

            //increment
            viewModel.appRestartRetryCount(viewModel.appRestartRetryCount() + 1);
            //update the prog bar... (we'll ony go a max of 90... since its a false prog bar anyways)
            //also, we'll make this look slightly more random by doing it on a timeout
            if (viewModel.appRestartRetryCount() < 90) {
                setTimeout(function() {
                    if (viewModel.appRestartRetryCount() < 90) {
                        Umbraco.Installer.updateProgressBar(viewModel.appRestartRetryCount(), "#progressBarRestart");
                    }     
                }, Math.randomRange(1, 400));
            }
            
            //recurse!
            setTimeout(function() {appRestart(statusCheck ? "wait": true);}, 1000);

        }

        return {
            init: function(o) {
                _opts = o;     
                
                $(".btn-box").hide();
                                           
                //apply knockout js bindings
                ko.applyBindings(viewModel);
                                
                //restart the app                          
                appRestart(false);
            }
        }
    }(); //singleton
    
})(jQuery);