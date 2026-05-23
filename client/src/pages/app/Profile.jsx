import { useEffect, useRef, useState } from "react";
import Button from "../../components/Button.jsx";
import { Card, CardHeader } from "../../components/Card.jsx";
import Avatar from "../../components/Avatar.jsx";
import GuestUpgradeBanner from "../../components/GuestUpgradeBanner.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { useToast } from "../../hooks/useToast.js";

export default function Profile() {
  const { user, updateProfile, loading } = useAuthStore();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [cropSource, setCropSource] = useState("");
  const [profile, setProfile] = useState(() => profileFromUser(user));

  useEffect(() => {
    setProfile(profileFromUser(user));
  }, [user?.id]);

  if (user?.isGuest) {
    return (
      <div className="workspace-page">
        <CardHeader title="Profile" subtitle="Profile photos and saved account details need a free AnonChat account." />
        <GuestUpgradeBanner />
      </div>
    );
  }

  function patch(key, value) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast("Please choose an image file.", "danger");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setCropSource(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  async function saveProfile() {
    try {
      const nextUser = await updateProfile(profilePayload(profile, user));
      setProfile(profileFromUser(nextUser));
      toast("Profile updated!", "success");
    } catch (error) {
      toast(error.message, "danger");
    }
  }

  async function removePhoto() {
    try {
      const nextProfile = { ...profile, avatarDataUrl: "" };
      setProfile(nextProfile);
      const nextUser = await updateProfile(profilePayload(nextProfile, user));
      setProfile(profileFromUser(nextUser));
      toast("Profile photo removed.", "success");
    } catch (error) {
      toast(error.message, "danger");
      setProfile(profileFromUser(user));
    }
  }

  return (
    <div className="workspace-page">
      <CardHeader title="Profile" subtitle="Your display name and photo appear on chat messages." />
      <Card className="profile-editor">
        <div className="profile-photo-block">
          <button className="profile-avatar-button" type="button" onClick={openFilePicker} aria-label="Change profile photo">
            <Avatar name={profile.displayName || "Anonymous"} src={profile.avatarDataUrl} />
            <span className="camera-overlay" aria-hidden="true">📷</span>
          </button>
          <button className="change-photo-text" type="button" onClick={openFilePicker}>Change photo</button>
          {profile.avatarDataUrl ? <button className="remove-photo-text" type="button" onClick={removePhoto}>Remove photo</button> : null}
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFile} />
        </div>

        <div className="profile-form-grid">
          <label>
            <span>Chat display name</span>
            <input value={profile.displayName} onChange={(event) => patch("displayName", event.target.value)} />
          </label>
          <label>
            <span>Full Name</span>
            <input value={profile.fullName} onChange={(event) => patch("fullName", event.target.value)} placeholder="Your full name" />
          </label>
          <label>
            <span>Contact</span>
            <input value={profile.contactNumber} onChange={(event) => patch("contactNumber", event.target.value)} placeholder="Phone or contact" />
          </label>
          <label>
            <span>Department</span>
            <input value={profile.department} onChange={(event) => patch("department", event.target.value)} placeholder="CSE" />
          </label>
          <label>
            <span>Study Year</span>
            <select value={profile.studyYear} onChange={(event) => patch("studyYear", event.target.value)}>
              <option value="1">1st year</option>
              <option value="2">2nd year</option>
              <option value="3">3rd year</option>
              <option value="4">4th year</option>
            </select>
          </label>
        </div>

        <label className="profile-bio">
          <span>Bio</span>
          <textarea rows="4" value={profile.bio} onChange={(event) => patch("bio", event.target.value)} placeholder="Write a short anonymous bio." />
        </label>

        <Button className="profile-save-btn" loading={loading} onClick={saveProfile}>Save Profile</Button>
      </Card>

      {cropSource ? (
        <CropModal
          source={cropSource}
          onCancel={() => setCropSource("")}
          onSave={(dataUrl) => {
            patch("avatarDataUrl", dataUrl);
            setCropSource("");
          }}
        />
      ) : null}
    </div>
  );
}

function profilePayload(profile, user) {
  return {
    fullName: profile.fullName,
    anonymousName: profile.displayName,
    about: profile.bio,
    gender: user?.gender || "prefer-not",
    department: profile.department,
    studyYear: profile.studyYear,
    contactNumber: profile.contactNumber || user?.contactNumber || "",
    avatarDataUrl: profile.avatarDataUrl,
  };
}

function profileFromUser(user) {
  return {
    displayName: user?.anonymousName || user?.name || "",
    fullName: user?.fullName || "",
    contactNumber: user?.contactNumber || "",
    department: user?.department || "",
    studyYear: user?.studyYear || "1",
    bio: user?.about || "",
    avatarDataUrl: user?.avatarDataUrl || "",
  };
}

function CropModal({ source, onCancel, onSave }) {
  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const [image, setImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = source;
  }, [source]);

  useEffect(() => {
    if (!image) return;
    drawPreview(canvasRef.current, image, zoom, offset);
  }, [image, offset, zoom]);

  function startDrag(event) {
    dragRef.current = { x: event.clientX, y: event.clientY, offset };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function drag(event) {
    if (!dragRef.current) return;
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    setOffset({ x: dragRef.current.offset.x + dx, y: dragRef.current.offset.y + dy });
  }

  function stopDrag() {
    dragRef.current = null;
  }

  function save() {
    if (!image) return;
    onSave(drawCroppedImage(image, zoom, offset));
  }

  return (
    <div className="crop-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <div className="crop-modal" role="dialog" aria-modal="true" aria-label="Crop profile photo">
        <div className="crop-modal-head">
          <div>
            <h2>Crop profile photo</h2>
            <p>Drag to reposition and use zoom for a clean circular avatar.</p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Close crop modal">×</button>
        </div>

        <canvas
          ref={canvasRef}
          width="280"
          height="280"
          className="crop-canvas"
          onPointerDown={startDrag}
          onPointerMove={drag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
        />

        <label className="zoom-control">
          <span>Zoom</span>
          <input type="range" min="0.5" max="3" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
        </label>

        <div className="crop-actions">
          <button type="button" className="crop-cancel" onClick={onCancel}>Cancel</button>
          <button type="button" className="crop-save" onClick={save}>Save Photo</button>
        </div>
      </div>
    </div>
  );
}

function drawPreview(canvas, image, zoom, offset) {
  if (!canvas) return;
  const size = canvas.width;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.fillStyle = "#0f1018";
  ctx.fillRect(0, 0, size, size);
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
  ctx.clip();
  drawImageCover(ctx, image, size, zoom, offset);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(167, 139, 250, 0.65)";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawCroppedImage(image, zoom, offset) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.clip();
  drawImageCover(ctx, image, size, zoom, { x: offset.x * (size / 280), y: offset.y * (size / 280) });
  ctx.restore();
  return canvas.toDataURL("image/png", 0.92);
}

function drawImageCover(ctx, image, size, zoom, offset) {
  const baseScale = Math.max(size / image.width, size / image.height);
  const scale = baseScale * zoom;
  const width = image.width * scale;
  const height = image.height * scale;
  const x = (size - width) / 2 + offset.x;
  const y = (size - height) / 2 + offset.y;
  ctx.drawImage(image, x, y, width, height);
}
