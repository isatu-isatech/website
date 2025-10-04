/* eslint-disable @typescript-eslint/no-explicit-any */

// CSS Module declarations
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

// 3D Model declarations
declare module "*.glb" {
  const src: string;
  export default src;
}

// MeshLine library declarations
declare module "meshline" {
  export const MeshLineGeometry: any;
  export const MeshLineMaterial: any;
}

// JSX Custom Elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}
