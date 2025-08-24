import React, { useEffect } from 'react';
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import TurboNode from './TurboNode';

const nodeTypes = {
  turbo: TurboNode
};

const RoadmapCanvas = ({ initialNodes, initialEdges }: any) => {
  const { fitView } = useReactFlow();

  // Fit view when nodes are loaded
  useEffect(() => {
    setTimeout(() => {
      fitView({ duration: 800, padding: 0.3 });
    }, 100);
  }, [initialNodes, fitView]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow 
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
        panOnDrag={true} // Enable canvas panning/dragging
        panOnScroll={true} // Enable panning with scroll wheel
        nodesDraggable={false} // Disable node moving
        nodesConnectable={false} // Disable connecting nodes
        elementsSelectable={false} // Disable selecting elements
        zoomOnScroll={true} // Enable zooming with scroll
        zoomOnPinch={true} // Enable zooming on touch devices
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

// Wrap with ReactFlowProvider
const RoadmapCanvasWithProvider = (props: any) => (
  <ReactFlowProvider>
    <RoadmapCanvas {...props} />
  </ReactFlowProvider>
);

export default RoadmapCanvasWithProvider;