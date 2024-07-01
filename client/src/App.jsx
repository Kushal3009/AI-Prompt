import { useState } from "react";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [prompts, setPrompts] = useState(""); // State to store prompts

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCopied(false);
    try {
      const response = await axios.post("http://localhost:3000/", { prompt });
      const data = response.data.response;
      const prompts = response.data.prompt; // Assign prompts from response data
      setPrompts(prompts); // Set prompts state
      const parsedData = parseResponse(data);
      setResponseData(parsedData);
      setPrompt("");
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setLoading(false);
    }
  };

  const parseResponse = (data) => {
    const lines = data.split("\n");
    const result = [];
    let currentSegment = { type: "text", content: "" };

    lines.forEach((line) => {
      if (line.startsWith("```")) {
        if (currentSegment.type === "text") {
          if (currentSegment.content.trim() !== "") {
            result.push(currentSegment);
          }
          currentSegment = { type: "code", content: "" };
        } else {
          if (currentSegment.content.trim() !== "") {
            result.push(currentSegment);
          }
          currentSegment = { type: "text", content: "" };
        }
      } else {
        // Replace '**' or '*' with ''
        line = line.replace(/\*\*|\*/g, "");

        currentSegment.content += line + "\n";
      }
    });

    if (currentSegment.content.trim() !== "") {
      result.push(currentSegment);
    }

    return result;
  };

  return (
    <>
      <Navbar />
      <div className="container my-1" style={{ height: "90vh" }}>
        <div
          className="container border border-2 overflow-scroll x-scroll-hidden"
          style={{ height: "80vh", backgroundColor: "#EEEDEB" }}
        >
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "100%" }}
            >
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {prompts && (
                <h3
                  className="mb-3 container border border-1 my-1 py-1 rounded-3"
                  style={{ backgroundColor: "gray", color: "white" }}
                >
                  {prompts}
                </h3>
              )}
              {responseData.length > 0 ? (
                responseData.map((segment, index) => (
                  <div key={index} className="mb-3">
                    {segment.type === "text" ? (
                      <div>
                        {segment.content
                          .trim()
                          .split("\n")
                          .filter((point) => point.trim() !== "") // Filter out empty points
                          .map((point, idx) => (
                            <p key={idx} className="mb-1">
                              {point}
                            </p>
                          ))}
                      </div>
                    ) : (
                      <div className="code-container">
                        <SyntaxHighlighter
                          language="javascript"
                          style={dark}
                          wrapLines={true}
                        >
                          {segment.content.trim()}
                        </SyntaxHighlighter>
                        <CopyToClipboard
                          text={segment.content.trim()}
                          onCopy={() => setCopied(true)}
                        >
                          <button className="btn btn-secondary btn-sm ms-2">
                            Copy code
                          </button>
                        </CopyToClipboard>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center mt-5 d-flex align-items-center justify-content-center flex-column">
                  <h3
                    className="fs-1 mb-4"
                    style={{
                      fontFamily: "Playwrite AU SA",
                      fontWeight: "bold",
                    }}
                  >
                    Welcome to AI Prompt
                  </h3>
                  <p
                    className="fs-2"
                    style={{ fontFamily: "Hind", fontWeight: "700" }}
                  >
                    Discover AI-generated insights! Enter a query and click
                    Submit to explore.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        <div className="container">
          <form
            className="my-2 d-flex align-items-center justify-content-between container-fluid gap-2"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
