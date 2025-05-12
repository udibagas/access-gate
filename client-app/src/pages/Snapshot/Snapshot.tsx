import { Image, Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import PageHeader from '../../components/PageHeader';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../lib/api';
import { DataNode } from 'antd/es/tree';

const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });

export default function Snapshot() {
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    axiosInstance.get('/api/snapshots')
      .then((response) => {
        setTreeData(response.data);
      })
  }, [])

  const onSelect: TreeProps['onSelect'] = (selectedKeys) => {
    setSelected(selectedKeys as string[]);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };

  function onLoadData(treeNode: TreeDataNode): Promise<void> {
    return new Promise<void>((resolve) => {
      if (treeNode.children) return resolve();

      axiosInstance.get(`/api/snapshots/?directory=${treeNode.key}`)
        .then((response) => {
          setTreeData((origin) => updateTreeData(origin, treeNode.key, response.data));
          resolve();
        }).catch(() => resolve())
    });
  }

  return (
    <>
      <PageHeader title="Snapshot">
      </PageHeader>

      <div className='flex gap-4'>
        <div className='min-w-[400px] border-1 border-gray-300 rounded-md p-4 h-[calc(100vh-230px)] overflow-y-auto'>
          <Tree
            showIcon
            showLine
            checkable
            onSelect={onSelect}
            onCheck={onCheck}
            treeData={treeData}
            loadData={async (treeNode) => onLoadData(treeNode)}
          />
        </div>
        <div className='flex items-center justify-center w-full border-1 border-gray-300 rounded-md p-4 h-[calc(100vh-230px)]'>
          {selected.length > 0 && <Image src={`http://localhost:3000/` + selected[0]} alt="Snapshot" width={350} />}
        </div>
      </div>
    </>
  );
};
