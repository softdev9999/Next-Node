class ExtensionMessagingClient {
    constructor(senderId) {
        this.senderId = senderId;
    }

    sendMessage = (data) => {
        if (!data.sender) {
            data.sender = this.senderId;
        }
        data.via = this.senderId;
        data.source = "scener";
        window.postMessage(data, "*");
    };

    sendRequest = (requestData, timeout = 2000) => {
        requestData.request = true;
        return new Promise((resolve, reject) => {
            let requestTimeout = setTimeout(() => {
                window.removeEventListener("message", responseHandler);
                reject({ error: "timeout", request: requestData });
            }, timeout); 

            let responseHandler = ({ data }) => {
                if (requestData.name == data.name && data.response == true && data.sender != data.target) {
                    window.removeEventListener("message", responseHandler);
                    clearTimeout(requestTimeout);
                    resolve(data);
                }
            };

            window.addEventListener("message", responseHandler);
            this.sendMessage(requestData);
        });
    };

    addListener = (cb) => {
        window.addEventListener("message", cb, false);
        return () => {
            window.removeEventListener("message", cb);
        };
    };
    removeListener = (cb) => {
        window.removeEventListener("message", cb);
    };
}
export default ExtensionMessagingClient;
