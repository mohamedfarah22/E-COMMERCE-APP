
import './Chatbot.css';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import { useState, useEffect } from "react";

const API_KEY = process.env.REACT_APP_AI_KEY
function Chatbot() {
    const [openChatBot, setOpenChatBot] = useState(false);
    const [typing, setTyping] = useState(false)
   const [messages, setMessages] = useState([
    {
        message: "Hello, I am your shopping assistant for luxuria, need a hand?",
        sender:"ChatGPT",
        sendTime: "Now"

    }
   ]) //[]
    const onClickHandler = (e) => {
      e.preventDefault();
      setOpenChatBot(!openChatBot);
    };
    const handleSend = async (message) =>{
        const newMessage = {
            message: message,
            sender: "user",
            direction: "outgoing"
        }

        const newMessages = [...messages, newMessage]
        //update state
        setMessages(newMessages)
        //set typing to true
        setTyping(true)
        //process messages send to chatgpt and see the response
        await processMessageToChatGPT(newMessages)

    }

    async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
        // Format messages for chatGPT API
        // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
        // So we need to reformat
    
        let apiMessages = chatMessages.map((messageObject) => {
          let role = "";
          if (messageObject.sender === "ChatGPT") {
            role = "assistant";
          } else {
            role = "user";
          }
          return { role: role, content: messageObject.message}
        });
        const systemMessage = {
            role: "system",
            content: `You are a shopping assistant for a luxury gold jewlery store that sells bangles, earring, necklaces and rings. I will give you a list of inventory products in this insert statement pattern: 
            products (product_name, product_description, category, price)
            ('Elegant Gold Bangle','Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.', 'bangles', 1100);
        ('Dainty Gold Bangle', 'Embrace subtle luxury with this dainty gold bangle, weighing just 15 grams. Its lightweight charm and delicate craftsmanship ensure it''s perfect for everyday wear.','bangles', 1350)
        ('Luxurious Gold Bangle', 'Indulge in opulence with this luxurious gold bangle, weighing a lavish 20 grams. The gleaming gold and ornate detailing create a statement piece that exudes grandeur.', 'bangles', 2250)
        ('Elegant Gold Earrings', 'Elevate your elegance with these elegant gold earrings, each weighing a dainty 5 grams. Their intricate design and lightweight feel make them perfect for adding a touch of sophistication to any outfit.', 'earrings', 350)
        ('Dazzling Gold Earrings', 'Indulge in luxury with these dazzling diamond earrings, weighing a glamorous 10 grams. The sparkling diamonds and exquisite craftsmanship create a statement piece that captures attention.', 'earrings', 1499.99)
        ('Charming Gold Earrings', 'Embrace classic charm with these charming pearl earrings, each weighing a delicate 3 grams. The lustrous pearls and timeless design make them an ideal accessory for both casual and formal occasions.', 'earrings', 299.99)
        ('Classic Gold Chain Necklace', 'Elevate your style with this classic gold chain necklace, weighing a substantial 15 grams. Its timeless design and durable construction make it a versatile accessory for any occasion.', 'necklaces', 899.99)
        ('Glamorous Gold Pendant Necklace', 'Make a statement with this glamorous pendant necklace, weighing 8 grams. The intricate pendant and shimmering chain create a stunning focal point for your ensemble.', 'necklaces', 599.99)
        ('Chic Gold Choker Necklace', 'Elevate your neckline with this chic gold choker necklace, weighing 6 grams. Its modern design and comfortable fit make it an ideal accessory for both casual and formal looks.', 'necklaces', 449.99)
        ('Classic Gold Band Ring', 'Embrace timeless elegance with this classic gold band ring, weighing 6 grams. Its simple yet sophisticated design makes it a versatile accessory for any occasion.', 'rings', 499.99)
        ('Sparkling Gold Halo Ring', 'Radiate brilliance with this diamond halo ring, weighing 4.5 grams. The dazzling center diamond is surrounded by a halo of smaller diamonds for maximum sparkle.', 'rings', 899.99)
        ('Modern Geometric Gold Ring', 'Add a touch of modernity with this geometric gold ring, weighing 3 grams. The sleek lines and contemporary design make it a versatile addition to your collection.', 'rings', 299.99)`
    }
        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
              systemMessage,  // The system message DEFINES the logic of our chatGPT
              ...apiMessages // The messages from our chat with ChatGPT
            ]
          }
      
          await fetch("https://api.openai.com/v1/chat/completions", 
          {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + API_KEY,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
          }).then((data) => {
            return data.json();
          }).then((data) => {
            console.log(data);
            setMessages([...chatMessages, {
              message: data.choices[0].message.content,
              sender: "ChatGPT"
            }]);
            setTyping(false);
          });
        }
  //useffect to re-render when openchatbot state changes
  useEffect(() => {

  }, [openChatBot])
    return (
      <div className={`chat-bot-container ${openChatBot ? "open" : "closed"}`}>
        <div className="chat-bot-header">
          <span className={`material-symbols-outlined ${openChatBot ? "open" : "closed"}`} onClick={onClickHandler}>
            minimize
          </span>
        </div>
  
        <MainContainer className={`MainContainer ${openChatBot ? "open" : "closed"}`}>
          <ChatContainer className={`ChatContainer ${openChatBot ? "open" : "closed"}`}>
          <MessageList className={`message-list ${openChatBot ? "open" : "closed"}`} 
          typingIndicator = {typing ? <TypingIndicator content="Assistant is typing" />: null}>
            
            {openChatBot && messages.map((message, i) => (
            <Message key={i} model={message} />
            ))}
        </MessageList>
        <MessageInput
            className={`messageInput ${openChatBot ? "open" : "closed"}`}
             placeholder="Type message here"
             onSend = {handleSend}
            />

          </ChatContainer>
        </MainContainer>
      </div>
    );
  }
  
  export default Chatbot;
  

