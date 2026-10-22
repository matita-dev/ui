import React from 'react';
import { DrawingMode } from './DrawingMode.jsx';
export function PencilMode({enabled=true,children,style}){
  return <DrawingMode mode={enabled?'pencil':'ink'} style={style}>{children}</DrawingMode>;
}
