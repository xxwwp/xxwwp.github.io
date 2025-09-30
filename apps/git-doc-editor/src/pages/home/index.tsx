import { app } from "@/feature/app/instance";
import { Button, Input, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Home() {
  const [auth, setAuth] = useState("");
  const navigate = useNavigate();

  async function handleFetchRepo() {
    try {
      await app.init(auth);
      await app.service.repos.trigger();
      navigate("/repos");
    } catch (error) {
      message.error("拉取仓库失败");
      throw error;
    }
  }

  return (
    <div>
      <Input value={auth} onChange={(e) => setAuth(e.target.value)} />
      <Button htmlType="button" onClick={handleFetchRepo}>
        拉取仓库
      </Button>
    </div>
  );
}
