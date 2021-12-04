const AWS = require('aws-sdk');
var ses = new AWS.SES({
    region: 'us-east-1'
});

exports.handler = (event, context, callback) => {
    // console.log(event.Records[0].Sns);
    // var event_data = [JSON.parse(event).message];
    
    console.log("SNS Data===========>"+JSON.stringify(event));
    

    async function mainFunction() {
        sendEmail()
    }
    mainFunction();

    function sendEmail() {
        var sender = "admin@prod.dwarak.me"
        
        var to_address = JSON.parse(event.Records[0].Sns.Message).EmailAddress;
        var accestoken = JSON.parse(event.Records[0].Sns.Message).AccessToken;


        return new Promise(function (resolve, reject) {
            var eParams = {
                Destination: {
                    ToAddresses: [to_address]
                },
                Message: {
                    Body: {
                        Html: {
                            //Data: links
                            Data: '<html><head>' +
                                '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
                                '<title>' + "Verification Email" + '</title>' +
                                '</head><body>' +
                                'This is the link to verify your account this link is valid for five minutes.' +
                                '<br><br>' +
                                "<a href=\"http://" + "prod.dwarak.me" + "/v1/verifyUserEmail?email=" + to_address + "&token=" + accestoken + "\">" +
                                "http://" + "prod.dwarak.me" + "/v1/verifyUserEmail?email=" + to_address + "&token=" + accestoken + "</a>"
                                +'</body></html>'
                        }
                    },
                    Subject: {
                        Data: "Verification Email"
                    }
                },
                Source: sender
            };
            ses.sendEmail(eParams, function (err, data2) {
                if (err) {
                    reject(new Error(err));
                } else {
                    context.succeed(event);
                    resolve(data2);
                }
            });
        });
    }
}
