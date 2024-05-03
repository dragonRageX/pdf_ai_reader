import * as React from "react";

interface Message {
    question: string;
    response: string
}

export default function App() {   //svg wave effect made using - https://getwaves.io/
    let [text, setText] = React.useState<string>("");
    let [messages, setMessages] = React.useState<Message[]>([]);

    async function getResponse()
    {
        try {
            const response = await fetch(`http://localhost:3000/api/database/${text}`);
            const data = await response.json();
            console.log("Response:", data);
            setMessages((prevMessages) => {
                return ([
                    ...prevMessages,
                    {
                        question: text,
                        response: data.content
                    }
                ]);
            });

        } catch (error) {
            console.error(error);
        }

        setText("");
    }
    
    return (
        <div className="chat-bot">
            <div className="header">
                <div className="info-container">
                    <h3>Chat with</h3>
                    <h2>◓ BookBot</h2>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgb(1, 31, 75)" fillOpacity="1" d="M0,96L34.3,117.3C68.6,139,137,181,206,170.7C274.3,160,343,96,411,112C480,128,549,224,617,250.7C685.7,277,754,235,823,186.7C891.4,139,960,85,1029,69.3C1097.1,53,1166,75,1234,117.3C1302.9,160,1371,224,1406,256L1440,288L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"></path></svg>
            </div>
            <div className="feed">
                {
                    messages?.map((message, _index) => 
                        <div key={_index}>
                            <div className="question bubble">{message.question}</div>
                            <div className="response bubble">{message.response}</div>
                        </div>
                    )
                }
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} />
            <button onClick={getResponse}>⇨</button>
        </div>
    );
}
