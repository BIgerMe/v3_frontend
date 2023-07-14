/*克隆*/
export function clone( source: { clone: () => any; } ) {
  const sourceLookup = new Map();
  const cloneLookup = new Map();
  const clone = source.clone();
  parallelTraverse( source, clone, function ( sourceNode, clonedNode ) {
    sourceLookup.set( clonedNode, sourceNode );
    cloneLookup.set( sourceNode, clonedNode );
  } );

  clone.traverse( function ( node: {
    bindMatrix: any;
    skeleton: any;
    isSkinnedMesh: any;
    bind(skeleton: any, bindMatrix: any): void;
  } ) {
    if ( ! node.isSkinnedMesh ) return;
    const clonedMesh = node;
    const sourceMesh = sourceLookup.get( node );
    const sourceBones = sourceMesh.skeleton.bones;
    clonedMesh.skeleton = sourceMesh.skeleton.clone();
    clonedMesh.bindMatrix.copy( sourceMesh.bindMatrix );
    clonedMesh.skeleton.bones = sourceBones.map( function ( bone: any ) {
      return cloneLookup.get( bone );
    } );
    clonedMesh.bind( clonedMesh.skeleton, clonedMesh.bindMatrix );
  } );
  return clone;
}
function parallelTraverse( a: { clone?: () => any; children?: any; }, b: { children: any[]; }, callback: { (sourceNode: any, clonedNode: any): void; (arg0: any, arg1: any): void; } ) {
  callback( a, b );
  for ( let i = 0; i < a.children.length; i ++ ) {
    parallelTraverse( a.children[ i ], b.children[ i ], callback );
  }
}
