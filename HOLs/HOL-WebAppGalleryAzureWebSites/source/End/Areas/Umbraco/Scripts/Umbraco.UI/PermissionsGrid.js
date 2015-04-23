/// <reference path="../../Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.UI");


(function ($, Base) {

    // Initializes a new instance of the PermissionsGrid class.
    Umbraco.UI.PermissionsGrid = Base.extend({

        _opts: null,
            
        _viewModel: null,
            
        constructor: function (el, o) {
            
            this._opts = $.extend({
                userGroupPermissionsModel: {},
                isReadOnly: false
            }, o);
            
            //apply knockout js binding attribute to elementh
            $(el).attr("data-bind", "template: { name : 'permissionsGrid', data: userGroupPermissionsModel, templateOptions: { isReadOnly : isReadOnly } }");
        
            //knockout js view model for managing the tree picker value
            this._viewModel = {
                userGroupPermissionsModel: new Umbraco.UI.PermissionsGridUserGroupPermissionsModel(this._opts.userGroupPermissionsModel),
                isReadOnly: this._opts.isReadOnly
            };

            //knockout js apply bindings, scoped to the current permissions grid
            ko.applyBindings(this._viewModel, el);
            
        },
        
        getPermissions: function () {
            return this._viewModel.userGroupPermissionsModel;
        }

    });

    // View models
    Umbraco.UI.PermissionsGridUserGroupPermissionsModel = function (val) {
        return {
            userGroupId: ko.observable(val.userGroupId),
            userGroupName: ko.observable(val.userGroupName),
            permissions: ko.observableArray(new Umbraco.UI.PermissionsGridPermissionStatusModelCollection(val.permissions)),
            allowAll: function () {
                var p = this.permissions();
                for(var i = 0; i < p.length; i++) {
                    var permission = p[i];
                    permission.status('Allow');
                }
            },
            denyAll: function () {
                var p = this.permissions();
                for(var i = 0; i < p.length; i++) {
                    var permission = p[i];
                    permission.status('Deny');
                }
            },
            inheritAll: function () {
                var p = this.permissions();
                for(var i = 0; i < p.length; i++) {
                    var permission = p[i];
                    permission.status('Inherit');
                }
            }
        };
    };
    
    Umbraco.UI.PermissionsGridPermissionStatusModelCollection = function(val) {
        var permissions = [];
        for(var i = 0; i < val.length; i++) {
            permissions.push(new Umbraco.UI.PermissionsGridPermissionStatusModel(val[i]));
        }
        return permissions;
    };
    
    Umbraco.UI.PermissionsGridPermissionStatusModel = function(val) {
        return {
            permissionId: ko.observable(val.permissionId),
            permissionName: ko.observable(val.permissionName),
            status: ko.observable(val.status),
            initialStatus: val.status,
            inheritedStatus: ko.observable(val.inheritedStatus),
            oldStatus: val.status == 'Inherit' ? val.inheritedStatus : val.status,
            disabledAllowClick: function () {
                this.status('Allow');
            },
            disabledDenyClick: function () {
                this.status('Deny');
            },
            toggleInherit: function (e) {
                e.preventDefault();
                // Workout next value
                var val = (this.status() == "Inherit") ? this.oldStatus : "Inherit";
                // Store current selection incase they just uncheck inherit
                this.oldStatus = (val == "Inherit") ? this.status() : this.oldStatus;
                // Set the status
                this.status(val);
            }
        };
    };

    // jQuery plugin
    $.fn.permissionsGrid = function(o) {
        
        var _opts = $.extend({
                inputField: $(this)
            }, o);
        
        return $(this).each(function() {
            var treePicker = new Umbraco.UI.PermissionsGrid(this, _opts);
            $(this).data("api", treePicker);
        });
        
    };

    // jQuery api plugin 
    $.fn.permissionsGridApi = function() {

        //ensure there's only 1
        if ($(this).length != 1) {
            throw "Requesting the API can only match one element";
        }

        //ensure thsi is a collapse panel
        if ($(this).data("api") == null) {
            throw "The matching element had not been bound to a treePicker";
        }

        return $(this).data("api");
    };
    
    // Define knockout js templates
    var gridTemplate = "<div class=\"box\">\
        <table class=\"standard highlight-row permissions-table\">\
            <thead>\
                <tr>\
                    <th>\
                        Permission\
                    </th>\
                    <th class=\"radio-col\">\
                        <a href=\"#\" data-bind=\"click: allowAll, visible: !$item.isReadOnly\">Allow</a>\
                        <span data-bind=\"visible: $item.isReadOnly\">Allow</span>\
                    </th>\
                    <th class=\"radio-col\">\
                        <a href=\"#\" data-bind=\"click: denyAll, visible: !$item.isReadOnly\">Deny</a>\
                        <span data-bind=\"visible: $item.isReadOnly\">Deny</span>\
                    </th>\
                    <th class=\"radio-col\">\
                        <a href=\"#\" data-bind=\"click: inheritAll, visible: !$item.isReadOnly\">Inherit</a>\
                        <span data-bind=\"visible: $item.isReadOnly\">Inherit</span>\
                    </th>\
                </tr>\
            </thead>\
            <tbody data-bind=\"template: { name : 'permissionsGridRow', foreach: permissions, templateOptions: { userGroupId: userGroupId, isReadOnly: $item.isReadOnly  } }\"></tbody>\
        </table>\
    </div>";

    var gridRowTemplate = "<tr data-id=\"${ permissionId }\">\
        <td>\
            <span data-bind=\"text: permissionName\"></span>\
            <span data-bind=\"visible: initialStatus != status()\" title=\"Value has changed.\"><img src=\"../../../../areas/umbraco/content/images/bullet_error.png\" alt=\"Alert\" /></span>\
        </td>\
        <td class=\"radio-col\" data-bind=\"css: { initialSelection : initialStatus == 'Allow' && initialStatus != status() }\">\
            <input type=\"radio\" name=\"${ $item.userGroupId }_${ permissionId }_status\" value=\"Allow\" data-bind=\"checked: status, visible: status() != 'Inherit', disable: $item.isReadOnly\" />\
            <span data-bind=\"visible: status() == 'Inherit'\" style=\"position:relative;\">\
                <input type=\"radio\" name=\"${ $item.userGroupId }_${ permissionId }_inheritedStatus\" value=\"Allow\" data-bind=\"checked: inheritedStatus\" disabled=\"disabled\" />\
                <div class=\"inherited-status-hotspot\" style=\"position:absolute; left:0; right:0; top:0; bottom:0;\" data-bind=\"click: disabledAllowClick\"></div>\
            </span>\
        </td>\
        <td class=\"radio-col\" data-bind=\"css: { initialSelection : initialStatus == 'Deny' && initialStatus != status() }\">\
            <input type=\"radio\" name=\"${ $item.userGroupId }_${ permissionId }_status\" value=\"Deny\" data-bind=\"checked: status, visible: status() != 'Inherit', disable: $item.isReadOnly\" />\
            <span data-bind=\"visible: status() == 'Inherit'\" style=\"position:relative;\">\
                <input type=\"radio\" name=\"${ $item.userGroupId }_${ permissionId }_inheritedStatus\" value=\"Deny\" data-bind=\"checked: inheritedStatus\" disabled=\"disabled\" />\
                <div class=\"inherited-status-hotspot\" style=\"position:absolute; left:0; right:0; top:0; bottom:0;\" data-bind=\"click: disabledDenyClick\"></div>\
            </span>\
        </td>\
        <td class=\"radio-col\" data-bind=\"css: { initialSelection : initialStatus == 'Inherit' && initialStatus != status() }\">\
            <input type=\"checkbox\" name=\"${ $item.userGroupId }_${ permissionId }_inherit\" data-bind=\"checked: status() == 'Inherit', event: { mousedown: toggleInherit }, click: function(){ return false; }, disable: $item.isReadOnly\" />\
        </td>\
    </tr>";
    
    // Append templates to the document
    $(function() {
        $("body")
            .append("<script id='permissionsGrid' type='text/html'>" + gridTemplate + "</script>")
            .append("<script id='permissionsGridRow' type='text/html'>" + gridRowTemplate + "</script>");
    });

})(jQuery, base2.Base);
