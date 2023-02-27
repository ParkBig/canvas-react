import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const colorList = [
  { color: "#1abc9c" },
  { color: "#3498db" },
  { color: "#34495e" },
  { color: "#27ae60" },
  { color: "#8e44ad" },
  { color: "#f1c40f" },
  { color: "#e74c3c" },
  { color: "#95a5a6" },
  { color: "#d35400" },
  { color: "#bdc3c7" },
  { color: "#2ecc71" },
  { color: "#e67e22" },
];
const strokeTypeList = [
  { id: "stroke", type: "선긋기" },
  { id: "toggleStroke", type: "선그리기" },
  { id: "fill", type: "채우기" },
  { id: "erase", type: "지우기" },
  { id: "delete", type: "삭제" },
  { id: "save", type: "저장하기" },
]

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [isPainting, setIsPainting] = useState<boolean>(false);
  const [drawType, setDrawType] = useState<string>("");
  const [rangeValue, setRangeValue] = useState<number>(5.5);
  const [color, setColor] = useState<string>("#000000");

  const mouseDown = () => {
    setIsPainting(true);
  };
  const mouseUp = () => {
    setIsPainting(false);
  };
  const startStrokeDrawing = (event: React.MouseEvent) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (drawType === "stroke") {
      ctx?.lineTo(offsetX, offsetY);
      ctx?.stroke();
      ctx?.beginPath();
      ctx?.moveTo(offsetX, offsetY);
    }
  }
  const startToggleDrawing = (event: React.MouseEvent) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (drawType === "toggleStroke" || drawType === "erase") {
      if (isPainting) {
        ctx?.lineTo(offsetX, offsetY);
        ctx?.stroke();
      }
      ctx?.beginPath();
      ctx?.moveTo(offsetX, offsetY);
    }
  };
  const saveImage = () => {
    const url = canvasRef.current?.toDataURL();
    const a = document.createElement("a");
    if (url) {
      a.href = url;
      a.download = "masterpiece.jpg";
      a.style.position = "absolute";
      a.click();
    }
  };
  const typeChange = (type: string) => {
    setDrawType(type);
    ctx?.beginPath();
    if (type === "fill") {
      ctx?.rect(0 ,0 ,window.innerWidth , window.innerHeight/1.25);
      ctx?.fill();
    }
    if (type === "delete") {
      ctx?.clearRect(0, 0, canvasRef.current ? canvasRef.current.width : 0, canvasRef.current ? canvasRef.current.height : 0 )
    }
    if (type === "save") {
      saveImage();
    }
    if (type === "erase") {
      if (ctx) {
        setColor("#FFFFFF");
        ctx.strokeStyle = "#FFFFFF";
        ctx.fillStyle = "#FFFFFF";
      }
    }
  };
  const drawSize = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setRangeValue(+ev.currentTarget.value)
    if (ctx) {
      ctx.lineWidth = +ev.currentTarget.value;
    }
  }
  const colorChange = (ev: React.MouseEvent<HTMLInputElement>) => {
    if (ctx) {
      setColor(`${ev.currentTarget.dataset.color}`)
      ctx.strokeStyle = `${ev.currentTarget.dataset.color}`;
      ctx.fillStyle = `${ev.currentTarget.dataset.color}`;
    }
  };
  const colorChoiceDetail = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ctx) {
      setColor(ev.currentTarget.value);
      ctx.strokeStyle = ev.currentTarget.value;
      ctx.fillStyle = ev.currentTarget.value;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight/1.25;
    window.addEventListener("resize", () => {canvas.width = window.innerWidth; canvas.height = window.innerHeight/1.25;})
    setCtx(ctx);
    ctx.lineWidth = 5.5;
    ctx.lineCap = "round"
    return window.removeEventListener("resize", () => {canvas.width = window.innerWidth; canvas.height = window.innerHeight/1.25;})
  }, []);
  return (
    <>
      <Choice>
        <UpperTypeChoice>
          {strokeTypeList.map((strokeType) =>
            <TypeChoice key={strokeType.id} onClick={() => typeChange(strokeType.id)}>
              {strokeType.type}
            </TypeChoice>
          )}
        </UpperTypeChoice>
      </Choice>
      <CanvasArea ref={canvasRef}
        onMouseMove={startToggleDrawing}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
        onMouseLeave={mouseUp}
        onClick={startStrokeDrawing}
      >
      </CanvasArea>
      <Choice>
        <UpperETC>
          <Etc>
            <InputName>
              Size
            </InputName>
            <Input type="range" min="1" max="10" step="0.5" 
              value={rangeValue}
              onChange={drawSize}
            />
          </Etc>
          <Etc>
            <InputName>
              현재색깔
            </InputName>
            <Input id="color" type="color"
              value={color}
              onChange={colorChoiceDetail}
            />
          </Etc>
        </UpperETC>
        <UpperColor>
          {colorList.map((color) => 
            <Color 
              key={color.color}
              style={{backgroundColor: color.color}}
              data-color={color.color}
              onClick={colorChange}
            >
            </Color>
          )}
        </UpperColor>
        {/* <UpperETC>
          <Btn onClick={saveImage}>
            저장하기
          </Btn>
        </UpperETC> */}
      </Choice>
    </>
  )
}

export default Canvas;

const CanvasArea = styled.canvas`
  border-top: 5px solid black;
  border-bottom: 5px solid black;
  background-color: white;
`;
const Choice = styled.div`
  width: 100%;
  height: 9%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const UpperTypeChoice = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3%;
`;
const TypeChoice = styled.div`
  width: 17%;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 10px;
  background-color: white;
  cursor: pointer;

  :hover {
    scale: 1.2;
  }
`;
const UpperColor = styled.div`
  width: 60%;
  height: 80%;
  margin-right: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1%;
`;
const Color = styled.div`
  width: 8%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid black;
`;
const UpperETC = styled.div`
  width: 35%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5%;
`;
const Etc = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const InputName = styled.div`
  height: 45%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Input = styled.input`
  height: 45%;
  width: 100%;
`;
