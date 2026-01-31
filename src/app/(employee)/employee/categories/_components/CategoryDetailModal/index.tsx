// "use client";

// import React, { useMemo, useState } from "react";
// import { Card, Button, Space, Tooltip, Tag, Modal, Spin } from "antd";
// import {
//     AppstoreOutlined,
//     ZoomInOutlined,
//     ZoomOutOutlined,
//     ReloadOutlined,
//     FullscreenOutlined,
// } from "@ant-design/icons";
// import { CategoryResponse } from "@/types/categories/category.detail";

// interface CategoryTreeVisualizationProps {
//     categories: CategoryResponse[];
//     loading?: boolean;
//     onCategoryClick?: (category: CategoryResponse) => void;
//     height?: number;
// }

// interface TreeNode {
//     id: string;
//     name: string;
//     slug: string;
//     active: boolean;
//     level: number;
//     children: TreeNode[];
//     parent?: TreeNode;
//     x?: number;
//     y?: number;
// }

// export const CategoryDetailModal: React.FC<CategoryTreeVisualizationProps> = ({
//     categories,
//     loading = false,
//     onCategoryClick,
//     height = 600,
// }) => {
//     const [zoom, setZoom] = useState(1);
//     const [panX, setPanX] = useState(0);
//     const [panY, setPanY] = useState(0);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);

//     // Build tree structure
//     const treeData = useMemo(() => {
//         if (!categories || categories.length === 0) return null;

//         const buildTree = (nodes: CategoryResponse[], parentId: string | null = null, level: number = 0): TreeNode[] => {
//             return nodes
//                 .filter((node) => {
//                     if (parentId === null) {
//                         return !node.parent?.id;
//                     }
//                     return node.parent?.id === parentId;
//                 })
//                 .map((node) => ({
//                     id: node.id,
//                     name: node.name,
//                     slug: node.slug,
//                     active: node.active,
//                     level,
//                     children: buildTree(nodes, node.id, level + 1),
//                 }));
//         };

//         return buildTree(categories);
//     }, [categories]);

//     // Calculate positions for tree layout (simple hierarchical layout)
//     const positionedTree = useMemo(() => {
//         if (!treeData) return null;

//         const calculatePositions = (
//             nodes: TreeNode[],
//             startX: number = 0,
//             startY: number = 50,
//             levelHeight: number = 120,
//             nodeWidth: number = 200
//         ): TreeNode[] => {
//             let currentX = startX;
//             const result: TreeNode[] = [];

//             nodes.forEach((node, index) => {
//                 const nodeX = currentX;
//                 const nodeY = startY + node.level * levelHeight;

//                 const positionedNode: TreeNode = {
//                     ...node,
//                     x: nodeX,
//                     y: nodeY,
//                     children: node.children.length > 0
//                         ? calculatePositions(node.children, currentX, startY, levelHeight, nodeWidth)
//                         : [],
//                 };

//                 result.push(positionedNode);

//                 // Calculate next X position
//                 if (node.children.length > 0) {
//                     const maxChildX = Math.max(
//                         ...positionedNode.children.map((child) => (child.x || 0) + nodeWidth)
//                     );
//                     currentX = Math.max(currentX + nodeWidth + 50, maxChildX);
//                 } else {
//                     currentX += nodeWidth + 50;
//                 }
//             });

//             return result;
//         };

//         return calculatePositions(treeData);
//     }, [treeData]);

//     const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
//     const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
//     const handleReset = () => {
//         setZoom(1);
//         setPanX(0);
//         setPanY(0);
//     };

//     const handleCategoryClick = (category: CategoryResponse) => {
//         setSelectedCategory(category);
//         onCategoryClick?.(category);
//     };

//     const renderNode = (node: TreeNode, parentX?: number, parentY?: number) => {
//         const nodeX = (node.x || 0) * zoom + panX;
//         const nodeY = (node.y || 0) * zoom + panY;

//         return (
//             <g key={node.id}>
//                 {/* Draw line to parent */}
//                 {parentX !== undefined && parentY !== undefined && (
//                     <line
//                         x1={parentX}
//                         y1={parentY + 30}
//                         x2={nodeX + 100}
//                         y2={nodeY + 15}
//                         stroke="#cbd5e1"
//                         strokeWidth="2"
//                         markerEnd="url(#arrowhead)"
//                     />
//                 )}

//                 {/* Node rectangle */}
//                 <g
//                     onClick={() => {
//                         const category = categories.find((c) => c.id === node.id);
//                         if (category) handleCategoryClick(category);
//                     }}
//                     style={{ cursor: "pointer" }}
//                 >
//                     <rect
//                         x={nodeX}
//                         y={nodeY}
//                         width={200}
//                         height={40}
//                         rx={8}
//                         fill={node.active ? "#10b981" : "#ef4444"}
//                         stroke="#fff"
//                         strokeWidth="2"
//                         className="hover:opacity-80 transition-opacity"
//                     />
//                     <text
//                         x={nodeX + 100}
//                         y={nodeY + 25}
//                         textAnchor="middle"
//                         fill="white"
//                         fontSize="14"
//                         fontWeight="500"
//                         className="pointer-events-none"
//                     >
//                         {node.name.length > 20 ? `${node.name.substring(0, 20)}...` : node.name}
//                     </text>
//                 </g>

//                 {/* Render children */}
//                 {node.children.map((child) => renderNode(child, nodeX + 100, nodeY + 20))}
//             </g>
//         );
//     };

//     const content = (
//         <div className="relative bg-gray-50 rounded-lg overflow-hidden" style={{ height: `${height}px` }}>
//             {/* Controls */}
//             <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-2">
//                 <Space>
//                     <Tooltip title="Phóng to">
//                         <Button
//                             icon={<ZoomInOutlined />}
//                             size="small"
//                             onClick={handleZoomIn}
//                         />
//                     </Tooltip>
//                     <Tooltip title="Thu nhỏ">
//                         <Button
//                             icon={<ZoomOutOutlined />}
//                             size="small"
//                             onClick={handleZoomOut}
//                         />
//                     </Tooltip>
//                     <Tooltip title="Đặt lại">
//                         <Button
//                             icon={<ReloadOutlined />}
//                             size="small"
//                             onClick={handleReset}
//                         />
//                     </Tooltip>
//                     <Tooltip title="Toàn màn hình">
//                         <Button
//                             icon={<FullscreenOutlined />}
//                             size="small"
//                             onClick={() => setIsFullscreen(true)}
//                         />
//                     </Tooltip>
//                 </Space>
//             </div>

//             {/* SVG Canvas */}
//             {loading ? (
//                 <div className="flex items-center justify-center h-full">
//                     <Spin size="large" />
//                 </div>
//             ) : positionedTree ? (
//                 <svg
//                     width="100%"
//                     height="100%"
//                     style={{ minHeight: `${height}px` }}
//                     className="overflow-visible"
//                 >
//                     <defs>
//                         <marker
//                             id="arrowhead"
//                             markerWidth="10"
//                             markerHeight="10"
//                             refX="9"
//                             refY="3"
//                             orient="auto"
//                         >
//                             <polygon points="0 0, 10 3, 0 6" fill="#cbd5e1" />
//                         </marker>
//                     </defs>
//                     {positionedTree.map((node) => renderNode(node))}
//                 </svg>
//             ) : (
//                 <div className="flex items-center justify-center h-full text-gray-400">
//                     <div className="text-center">
//                         <AppstoreOutlined className="text-4xl mb-2" />
//                         <p>Không có dữ liệu danh mục</p>
//                     </div>
//                 </div>
//             )}

//             {/* Legend */}
//             <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
//                 <Space>
//                     <Tag color="green">Hoạt động</Tag>
//                     <Tag color="red">Không hoạt động</Tag>
//                 </Space>
//             </div>
//         </div>
//     );

//     return (
//         <>
//             <Card
//                 title={
//                     <Space>
//                         <AppstoreOutlined />
//                         <span>Trực quan hóa cây danh mục</span>
//                     </Space>
//                 }
//                 extra={
//                     <Tag color="blue">
//                         {categories.length} danh mục
//                     </Tag>
//                 }
//             >
//                 {content}
//             </Card>

//             {/* Fullscreen Modal */}
//             <Modal
//                 open={isFullscreen}
//                 onCancel={() => setIsFullscreen(false)}
//                 footer={null}
//                 width="95vw"
//                 style={{ top: 20 }}
//                 bodyStyle={{ padding: 0, height: "90vh" }}
//             >
//                 <div className="relative bg-gray-50" style={{ height: "90vh" }}>
//                     <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-2">
//                         <Space>
//                             <Button
//                                 icon={<ZoomInOutlined />}
//                                 size="small"
//                                 onClick={handleZoomIn}
//                             />
//                             <Button
//                                 icon={<ZoomOutOutlined />}
//                                 size="small"
//                                 onClick={handleZoomOut}
//                             />
//                             <Button
//                                 icon={<ReloadOutlined />}
//                                 size="small"
//                                 onClick={handleReset}
//                             />
//                             <Button onClick={() => setIsFullscreen(false)}>Đóng</Button>
//                         </Space>
//                     </div>
//                     {positionedTree && (
//                         <svg
//                             width="100%"
//                             height="100%"
//                             style={{ minHeight: "90vh" }}
//                             className="overflow-visible"
//                         >
//                             <defs>
//                                 <marker
//                                     id="arrowhead-fullscreen"
//                                     markerWidth="10"
//                                     markerHeight="10"
//                                     refX="9"
//                                     refY="3"
//                                     orient="auto"
//                                 >
//                                     <polygon points="0 0, 10 3, 0 6" fill="#cbd5e1" />
//                                 </marker>
//                             </defs>
//                             {positionedTree.map((node) => renderNode(node))}
//                         </svg>
//                     )}
//                 </div>
//             </Modal>

//             {/* Category Detail Modal */}
//             {selectedCategory && (
//                 <Modal
//                     title="Chi tiết danh mục"
//                     open={!!selectedCategory}
//                     onCancel={() => setSelectedCategory(null)}
//                     footer={null}
//                 >
//                     <div className="space-y-2">
//                         <p><strong>Tên:</strong> {selectedCategory.name}</p>
//                         <p><strong>Slug:</strong> {selectedCategory.slug}</p>
//                         <p>
//                             <strong>Trạng thái:</strong>{" "}
//                             <Tag color={selectedCategory.active ? "green" : "red"}>
//                                 {selectedCategory.active ? "Hoạt động" : "Không hoạt động"}
//                             </Tag>
//                         </p>
//                         {selectedCategory.parent && (
//                             <p><strong>Danh mục cha:</strong> {selectedCategory.parent.name}</p>
//                         )}
//                         {selectedCategory.children && selectedCategory.children.length > 0 && (
//                             <p>
//                                 <strong>Số danh mục con:</strong> {selectedCategory.children.length}
//                             </p>
//                         )}
//                     </div>
//                 </Modal>
//             )}
//         </>
//     );
// };

