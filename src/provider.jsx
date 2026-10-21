import { createContext, useContext, useMemo } from 'react';

const Ctx = createContext({ rough: 1, stroke: 1.6 });

/** Theme provider. `rough` is the wobble amount for every sketch below (0 = clean lines, 1 = the full hand). */
export function MatitaProvider({ rough = 1, stroke = 1.6, style, children, ...rest }) {
  const value = useMemo(() => ({ rough, stroke }), [rough, stroke]);
  return (
    <Ctx.Provider value={value}>
      <div className="m-root" style={{ '--m-stroke': stroke, ...style }} {...rest}>{children}</div>
    </Ctx.Provider>
  );
}

export const useMatita = () => useContext(Ctx);
