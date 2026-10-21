import { Sketch } from './sketch.jsx';

/** A surface: a drawn frame and paper fill behind ordinary content. `as` picks the element (section, article, a…). */
export function Card({ as: Tag = 'div', radius = 0, className = '', children, ...rest }) {
  return (
    <Tag className={'m-card ' + className} {...rest}>
      <Sketch radius={radius} fill />
      <div className="m-card-body">{children}</div>
    </Tag>
  );
}
