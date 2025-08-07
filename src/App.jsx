import React, { useState, useEffect } from 'react';
import "./App.css";
import Navbar from './components/Navbar';
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import HashLoader from "react-spinners/HashLoader";

const App = () => {
  const options = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'cpp', label: 'C++' },
    { value: 'java', label: 'Java' },
    { value: 'go', label: 'Go' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'php', label: 'PHP' },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const ai = new GoogleGenAI({
    apiKey: "AIzaSyDHHqC_708Gqa5s6UvrNjaIfVL2MnNRGY8"
  });

  async function reviewCode() {
    setLoading(true);
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.
I’m sharing a piece of code written in ${selectedOption.value}.
Your job is to deeply review this code and provide the following:

1⃣ A quality rating: Better, Good, Normal, or Bad.
2⃣ Detailed suggestions for improvement, including best practices and advanced alternatives.
3⃣ A clear explanation of what the code does, step by step.
4⃣ A list of any potential bugs or logical errors, if found.
5⃣ Identification of syntax errors or runtime errors, if present.
6⃣ Solutions and recommendations on how to fix each identified issue.

Analyze it like a senior developer reviewing a pull request.

Code: ${code}`,
    });
    setResponse(res.text);
    setLoading(false);
  }

  async function fixCode() {
    setLoading(true);
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert-level software engineer.
The user provides a code written in ${selectedOption.value}.

Your job is to:
1. Show the improved version of this code (if needed), with best practices applied.
2. Provide the time and space complexity.
3. Give a short but useful description of the code.
4. If no issues found, just say it's optimal.

Code:
${code}`,
    });
    setResponse(res.text);
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <div className="main flex items-center justify-between" style={{ height: "calc(100vh - 90px)" }}>
        <div className="left h-[80%] w-[50%]">
          <div className="tabs w-full flex items-center gap-[10px]">
            <div className="select-container">
              <Select
                value={selectedOption}
                onChange={(e) => { setSelectedOption(e); }}
                options={options}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: '#18181b',
                    borderColor: state.isFocused ? '#3f3f46' : '#27272a',
                    color: '#fff',
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#3f3f46' },
                  }),
                  menu: base => ({ ...base, backgroundColor: '#18181b', color: '#fff' }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? '#27272a' : '#18181b',
                    color: '#fff',
                    cursor: 'pointer',
                  }),
                  singleValue: base => ({ ...base, color: '#fff' }),
                  placeholder: base => ({ ...base, color: '#a1a1aa' }),
                  input: base => ({ ...base, color: '#fff' }),
                }}
              />
            </div>
            <button
              onClick={() => {
                if (code === "") {
                  alert("Please enter code first");
                } else {
                  reviewCode();
                }
              }}
              className="btnNormal bg-zinc-900 min-w-[126px] transition-all hover:bg-zinc-800"
            >
              Review
            </button>

            <button
              onClick={() => {
                if (code === "") {
                  alert("Please enter code first");
                } else {
                  fixCode();
                }
              }}
              className="btnNormal bg-zinc-900 min-w-[126px] transition-all hover:bg-zinc-800"
            >
              Fix + TC
            </button>

            <button onClick={toggleTheme} className="ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
            </button>
          </div>

          <Editor
            height="100%"
            theme={darkMode ? "vs-dark" : "light"}
            width="100%"
            language={selectedOption.value}
            value={code}
            onChange={(e) => { setCode(e); }}
          />
        </div>

        <div className="right !p-[10px] bg-zinc-900 w-[50%] h-[100%]">
          <div className="topTabs border-b-[1px] border-t-[1px] border-[#27272a] flex items-center justify-between h-[60px]">
            <p className='font-[700] text-[17px]'>Response</p>
          </div>
          {loading ? <HashLoader color="#9333ea" /> : <Markdown>{response}</Markdown>}
        </div>
      </div>
    </>
  );
};

export default App;
