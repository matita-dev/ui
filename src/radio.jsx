import { Sketch } from './sketch.jsx';

/** Native radio (grouping, arrow keys and announcements stay the browser's) with a drawn ring and a drawn-in dot.
    Give radios in a group the same `name`. */
export function Radio({ children, className = '', ...rest }) {
  return (
    <label className={'m-check m-radio ' + className}>
      <input type="radio" {...rest} />
      <span className="m-check-box">
        <Sketch shape="ellipse" />
        <span className="m-dot"><Sketch shape="ellipse" fill /></span>
      </span>
      {children && <span className="m-check-label">{children}</span>}
    </label>
  );
}
