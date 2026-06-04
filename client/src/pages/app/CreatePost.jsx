import { useRef, useState } from "react";
import Button from "../../components/Button.jsx";
import { useToast } from "../../hooks/useToast.js";

export default function CreatePost() {
  const { toast } = useToast();
  const inputRef = useRef(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState("");

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Please choose an image file.", "danger");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();
    toast("Post composer is ready. Connect /api/posts after backend Post model is added.", "info");
  }

  return (
    <div className="ig-page ig-single-column-page">
      <div className="ig-page-head">
        <h1>Create new post</h1>
        <p>Upload media, write a caption and publish to the feed.</p>
      </div>
      <form className="ig-create-card" onSubmit={handleSubmit}>
        <button className="ig-upload-zone" type="button" onClick={() => inputRef.current?.click()}>
          {preview ? <img src={preview} alt="Selected post preview" /> : <span>Drag photos and videos here<br /><b>Select from computer</b></span>}
        </button>
        <input ref={inputRef} type="file" accept="image/*,video/*" hidden onChange={handleFile} />
        <textarea value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Write a caption..." rows="5" />
        <Button type="submit">Share</Button>
      </form>
    </div>
  );
}
