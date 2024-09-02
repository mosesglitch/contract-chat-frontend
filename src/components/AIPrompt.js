import React, { useState, useRef, useEffect } from "react";
import axios from 'axios'; // Ensure you have axios installed
import "../styles/aiprompt.css";
import AIChat from "../images/aichat.png";
import sendtoAI from "../images/sendtoAI.png";
import user from "../images/user.png";
import bot from "../images/bot.png";
import { IoSendOutline } from "react-icons/io5";
import { Dropdown } from 'semantic-ui-react'

// import { HalfFloatType } from "three";
import {
ComboBox,
ComboBoxItem,Icon
} from "@ui5/webcomponents-react";
function Aiprompt({isChatClicked}) {
  const [text, setText] = useState("");
  const [response, setResponse] = useState(null);
  const [responseList, setResponseList] = useState([
    { response: "Hallo, Ask this contract a query.." },
  ]);
  const [isFetching, setIsFetching] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [selectedContract,setSelectedContract]=useState("KPA")
  const textAreaRef = useRef(null);
  const chatContainerRef = useRef(null);

console.log(isChatClicked,"isChaatttt")
  useEffect(()=>{
    setIsInputVisible(isChatClicked)
  },[isChatClicked])

  const handleSubmit = async (e) => {
    // e.preventDefault();
    console.log(selectedContract,"halloo")
    const response = await fetch(`/Contracts/${selectedContract}.pdf`);
    const blob = await response.blob();
    const file = new File([blob], `${selectedContract}.pdf`, { type: 'application/pdf' });
    console.log(file,"filefilefile")
    setResponseList((prevList) => [
      ...prevList,
      { request: text, response: "Cooking up a response..Please wait "},
    ]);

    const currentIndex = responseList.length; // Index of the newly added item
    setIsFetching(true);
    setText("");

    if (!file) {
      setResponseList((prevList) =>
        prevList.map((item, index) =>
          index === currentIndex
            ? { ...item, response: `Upload resume to be able to chat with it!!` }
            : item
        )
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobDescription', text);

      // Replace with your server endpoint
      const res = await axios.post('https://contracts-chatter.onrender.com/query', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const flaskResponse = res;
      console.log(flaskResponse);
      setIsFetching(false);
      setResponse(flaskResponse.data.promptresponse);
      console.log(flaskResponse)
      setResponseList((prevList) =>
        prevList.map((item, index) =>
          index === currentIndex
            ? { ...item, response: flaskResponse.data.promptresponse }
            : item
        )
      );
    } catch (error) {
      console.error("Error during fetch:", error);
  
      // Update the response list to show an error message
      setResponseList((prevList) =>
        prevList.map((item, index) =>
          index === currentIndex
            ? { ...item, response: `An error occurred: ${error.message}` }
            : item
        )
      );
    } finally {
      setIsFetching(false);  // Always set fetching to false, regardless of success or error
    }
  };
  useEffect(() => {
    const handleFocus = () => {
      if (textAreaRef.current) {
        setTimeout(() => {
          textAreaRef.current.scrollIntoView({ behavior: "smooth" });
        }, 300); // Adjust timeout as needed
      }
    };

    const textAreaElement = textAreaRef.current;
    if (textAreaElement) {
      textAreaElement.addEventListener("focus", handleFocus);
    }

    return () => {
      if (textAreaElement) {
        textAreaElement.removeEventListener("focus", handleFocus);
      }
    };
  }, []);

  useEffect(() => {
    console.log(text, isFetching, "b4");
    if (chatContainerRef.current && isFetching) {
      console.log(responseList, "Howdychamp", isFetching);
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
      console.log(
        chatContainerRef.current.scrollTop,
        "sheight",
        chatContainerRef.current.scrollHeight
      );
    }
  }, [responseList]);

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsInputVisible(true);
    };

    const textarea = document.querySelector(".chatInput");
    if (textarea) {
      textarea.addEventListener("focus", handleScrollToTop);
      return () => {
        textarea.removeEventListener("focus", handleScrollToTop);
      };
    }
  }, []);
  useEffect(()=>{
    handleContractChange()
  },[selectedContract])
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior of adding a newline
      handleSubmit(); // Call the function you want to run
    }
  };
  console.log(selectedContract,"selelele")
const handleContractChange=(e)=>{
  if (e){
    setSelectedContract(e.target.innerText)
    console.log("fnrun",e.target.innerText)

  }
}
const options = [
  { key: 'KPA', text: 'KPA', value: 'KPA' },
  { key: 'KETRACO', text: 'KETRACO', value: 'KETRACO' },
  { key: 'Acciona', text: 'Acciona', value: 'Acciona' },
]
  return (
    <div className="AIPrompt">
      <div className="chatContainer">
        <div
          className="inputContainer"
          // style={{ display: isInputVisible ? "block" : "none" }}
        >
          <div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>

          {/* <div
            clasName="cancelButton"
            onClick={() => setIsInputVisible(false)}
            style={{ backgroundColor: "white",
              border:"1px solid blue",
              borderRadius:"3px",
              width:"50%"
             }}
          >
            Close chat
          </div>
       */}
          <div
          clasName="cancelButton"
          onClick={() => setIsInputVisible(false)}
          style={{ backgroundColor: " ",
            border:"1px solid blue",
            borderRadius:"3px",
            width:"50%"

           }}
          >

<Dropdown
    placeholder='Select Contract'
    fluid
    selection
    options={options}
    onChange={handleContractChange}
  /> </div>
          </div>

          <div className="responseContainer" ref={chatContainerRef}>
            {responseList?.map((item, index) => (
              <div className="reqres" key={index}>
                <p className="request">
                
                  {item?.request?.length > 0 && (
                    <p className=" requestp">{item.request}</p>
                  )}
                </p>
                <div className="response resitem">
                {item.response === "Cooking up a response..Please wait " ?  
                <div className="loadergreek"></div> :
          (
          <div
            dangerouslySetInnerHTML={{
              __html: item.response
                ?.replace(/\n/g, "<br/>")
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*(.*?)\*/g, "<em>$1</em>")
            }}
          ></div>
    
      ) }</div>
              </div>
            ))}
          </div>
        </div>
        <div className="AIContainer">
          <div className="aiIcon">
          
          </div>
          <div className="chatInputDiv">
            <textarea
              ref={textAreaRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Talk to your resume"
              required
              className="chatInput"
              onKeyDown={handleKeyDown}
            />
          </div>
          <div>
            {!isFetching ? (
              <IoSendOutline
                className="chatIcon"
                alt="hallo"
                onClick={handleSubmit}
              />
            ) : (
              <div className="loaderai"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Aiprompt;