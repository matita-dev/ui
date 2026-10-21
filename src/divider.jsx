import { Sketch } from './sketch.jsx';

/** A ruled line across the available width. It is a real separator for assistive tech. */
export function Divider({ className = '', ...rest }) {
  return (
    <div role="separator" className={'m-divider ' + className} {...rest}>
      <Sketch shape="line" />
    </div>
  );
}
