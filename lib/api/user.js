const client = require("../client");

/*section: user
 *comment: invite users via e-mail
 *params:
 *  emails: an array of email addresses to send invites to
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  const dogapi = require("dogapi");
 *  const options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  const emails = ["me@domain.com", "you@domain.com"];
 *  dogapi.user.invite(emails, fuction(err, res){
 *    console.dir(res):
 *  });
 *  ```
 */
function invite(emails, callback){
    const params = {
        body: {
            emails: emails
        }
    };
    client.request("POST", "/invite_users", params, callback);
};

module.exports = {
    invite: invite,
    getUsage: function(){
        return [
            "  dogapi user invite <address>..."
        ];
    },
    getHelp: function(){
        return [
            "User:",
            "  Subcommands:",
            "    invite <address>...  invite the given list of e-mail addresses to your datadog org"
        ];
    },
    handleCli: function(subcommand, args, callback){
        invite(args._.slice(4), callback)
    }
};
