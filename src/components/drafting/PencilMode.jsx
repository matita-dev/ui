import React from 'react';
import { DrawingMode } from './DrawingMode.jsx';
export function PencilMode({enabled=true,children,className,style}){
  return <DrawingMode mode={enabled?'pencil':'ink'} className={className} style={style}>{children}</DrawingMode>;
}
