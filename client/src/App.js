import { useState } from "react";
import axios from "axios";
import Editor from "./Editor";

function App() {
  const [content, setContent] = useState("");
  const [docId, setDocId] = useState(null);
  const [email, setEmail] = useState("");
  const [sharedDocs, setSharedDocs] = useState([]);

  const saveDoc = async () => {
    const res = await axios.post("https://mini-docs-56kr.onrender.com/save", { content });
    setDocId(res.data.id);
    alert("Saved!");
  };

  
  const loadDoc = async () => {
    const res = await axios.get("https://mini-docs-56kr.onrender.com/doc/1");
    setContent(res.data.content);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => setContent(event.target.result);
    reader.readAsText(file);
  };

  const shareDoc = async () => {
    await axios.post("https://mini-docs-56kr.onrender.com/share", { docId, email });
    alert("Shared!");
  };

  const fetchShared = async () => {
    const res = await axios.get("https://mini-docs-56kr.onrender.com/shared/test@gmail.com");
    setSharedDocs(res.data);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1>Mini Docs in react18</h1>
      <input type="file" onChange={handleFileUpload} />
      <br /><br />
      <br /><br />
      <button onClick={saveDoc} style={{ marginRight: "10px" }}>Save</button>
      <button onClick={loadDoc}>Load</button>
      <Editor content={content} onChange={setContent} />

      <h3>Share Document</h3>
      <input
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={shareDoc}>Share</button>

      <h3>Shared Docs</h3>
      <button onClick={fetchShared}>Load Shared</button>

      <ul>
        {sharedDocs.map((doc) => (
          <li key={doc.id}>Shared Doc ID: {doc.docId}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
