import React, { useEffect, useState } from "react";
import { Typography, Container, TextField, Button } from "@mui/material";
import "./index.css";

const Index = () => {
  const [currentValue, setCurrentValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const [file, setFile] = useState({});
  const [clicks, setClicks] = useState(0);

  const getHeadings = async () => {
    const res = await fetch(
      "https://courageous-ox-veil.cyclic.app/api/heading/get-headings"
    );
    const data = await res.json();
    setCurrentValue(data);
  };

  const getClicks = async () => {
    const res = await fetch(
      "https://courageous-ox-veil.cyclic.app/api/click/get-count"
    );
    const data = await res.json();
    setClicks(data.sum);
  };

  useEffect(() => {
    getHeadings();
    getClicks();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await fetch(
      "https://courageous-ox-veil.cyclic.app/api/heading/change-headings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: newValue,
          area: "main heading",
        }),
      }
    );
    const data = await res.json();
    if (data) {
      window.location.reload();
      setNewValue("");
    }
  };

  const uploadHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      "https://courageous-ox-veil.cyclic.app/api/upload-image",
      {
        method: "PUT",
        body: formData,
      }
    );
    const data = await res.json();
    if (data.file) {
      const res1 = await fetch(
        "https://courageous-ox-veil.cyclic.app/api/heading/change-logo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: data.file,
          }),
        }
      );
      const data1 = await res1.json();
      if (data1.success === true) {
        alert(data1.msg);
        setFile({});
      }
    }
  };

  return (
    <Container sx={{ textAlign: "center" }}>
      <Typography variant="h3" sx={{ marginBottom: "60px", marginTop: "60px" }}>
        Control Panel
      </Typography>
      <div className="change-head" style={{ marginBottom: "100px" }}>
        <div className="change-heading">
          <Typography variant="h4">Change Main Heading</Typography>
        </div>
        <div className="current-value">
          <Typography
            variant="subtitle1"
            sx={{ fontSize: "1.6rem", marginRight: "5px" }}
          >
            Current Value:
          </Typography>
          <span>{currentValue && currentValue.heading[0].current}</span>
        </div>
        <div className="changed-time">
          <Typography variant="subtitle1">Updated At:</Typography>
          <span>
            {currentValue &&
              `${new Date(currentValue.heading[0].updatedAt).getDate()}-${
                new Date(currentValue.heading[0].updatedAt).getMonth() + 1
              }-${new Date(currentValue.heading[0].updatedAt).getFullYear()}`}
          </span>
        </div>
        <div className="new-value">
          <Typography variant="subtitle1">New Heading:</Typography>
          <form onSubmit={submitHandler}>
            <TextField
              id="text"
              label="New Heading"
              value={newValue}
              onChange={(e) => {
                setNewValue(e.target.value);
              }}
              variant="standard"
            />
            <Button type="submit" variant="contained">
              Change
            </Button>
          </form>
        </div>
      </div>

      <div className="change-icon" style={{ marginBottom: "100px" }}>
        <Typography variant="h4">Change Icon</Typography>

        <div className="new-value">
          <Typography variant="subtitle1">New Icon:</Typography>
          <form onSubmit={uploadHandler}>
            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
            <Button type="submit" variant="contained">
              Change
            </Button>
          </form>
        </div>
      </div>
      <div className="show-count" style={{ marginBottom: "100px" }}>
        <Typography variant="h4">Number of demos requested:{clicks}</Typography>
      </div>
    </Container>
  );
};

export default Index;
