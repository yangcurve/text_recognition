import { useState } from "react";
import { createWorker } from "tesseract.js";
import defaultImage from "./assets/testocr.png";
import langs from "./assets/languages.json";

function App() {
  const [image, setImage] = useState(defaultImage);
  const [lang, setLang] = useState("eng");
  const [text, setText] = useState("");

  const worker = createWorker({ logger: (m) => console.log(m) });

  async function recognize() {
    await worker.load();
    await worker.loadLanguage(lang);
    await worker.initialize(lang);
    setText("Loading...");
    await worker
      .recognize(image)
      .catch((e) => {
        setText("failed");
        console.log(e);
      })
      .then(({ data: { text } }) => setText(text))
      .catch((e) => {
        setText("failed");
        console.log(e);
      })
      .finally(() => worker.terminate());
  }

  return (
    <div>
      <div>
        <input
          onChange={(e) => setImage(e.target.value)}
          placeholder="image url"
        />
        <img src={image} alt="text-image" />
      </div>

      <div>
        <select onChange={(e) => setLang(e.target.value)} defaultValue={lang}>
          {langs.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <button onClick={recognize}>recognize</button>
      </div>

      <p>{text}</p>
    </div>
  );
}
export default App;
