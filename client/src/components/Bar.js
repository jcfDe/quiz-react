export default function Bar(props){
return (
  <div className="bar">
    <p className="lineaH">-----------------------------------------------------------------------------</p>
    <div className="upper"><p> Timer: {props.count} segs</p> <p> Current Question: {props.current}</p> <p> Score: {props.score}/10</p></div>
    <p className="lineaH">-----------------------------------------------------------------------------</p>
  </div>
)
}