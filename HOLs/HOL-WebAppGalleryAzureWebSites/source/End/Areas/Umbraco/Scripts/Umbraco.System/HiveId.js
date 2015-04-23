Umbraco.System.registerNamespace("Umbraco.System");

(function ($, Base) {

    //HiveId class
    Umbraco.System.HiveId = Base.extend({
        ///<summary>A class to support validating the incoming object to ensure it has all of the HiveId parts and returning an object for which to access these parts</summary>

        _o: null,
            
        constructor: function (o) {
            if (!o) throw "HiveId cannot be constructed with a null argument";
            if (!o.rawValue) throw "HiveId malformed, the object does not contain a rawValue property";
            if (!o.htmlId) throw "HiveId malformed, the object does not contain an htmlId property";
            if (o.value == null) throw "HiveId malformed, the object does not contain a value property";
            if (o.valueType == null) throw "HiveId malformed, the object does not contain a valueType property";
            if (o.provider == null) throw "HiveId malformed, the object does not contain a provider property";
            if (o.scheme == null) throw "HiveId malformed, the object does not contain a scheme property";

            this._o = o;
        },

        htmlId: function() {
            ///<summary>Returns the html id representation of the HiveId</summary>
            return this._o.htmlId;
        },

        rawValue: function() {
            ///<summary>Returns the raw value used to create the object</summary>
            return this._o.rawValue;
        },
        value: function() {          
            ///<summary>Returns the decoded value</summary>  
                
            //TODO: This deals with the way the Hive id is serialized with IO root nodes
            return this._o.value == "/" ? "$$" : this._o.value;
        },
        valueType: function() {
            return this._o.valueType;
        },
        provider: function() {
            ///<summary>Returns the decoded provider</summary>
            return this._o.provider;
        },
        scheme: function() {
            ///<summary>Returns the decoded scheme</summary>
            return this._o.scheme;
        },
        equals: function(hiveId) {
            ///<summary>Returns true if this HiveId equals the HiveId parameter</summary>
            if (!hiveId) return false;
            //if raw values match then return true
            if (hiveId.rawValue() == this.rawValue()) return true;
            //if the value + scheme + value type match then return true
            if (hiveId.value() == this.value() && hiveId.scheme() == this.scheme() && hiveId.valueType() == this.valueType()) return true;

            //BUG: currently Hive doesn't return system:// id nodes with the system scheme and instead returns them as content:// so this is 
            // a work around. If we detect that the id value starts with 10000000-0000-0000-0000-000000 then we'll assume its system and not
            // compare the scheme.
            if (hiveId.value().toString().startsWith("10000000-0000-0000-0000-000000")) {
                if (hiveId.value() == this.value() && hiveId.valueType() == this.valueType()) return true;
            }

            //they are not equal
            return false;
        }

    });

})(jQuery, base2.Base);