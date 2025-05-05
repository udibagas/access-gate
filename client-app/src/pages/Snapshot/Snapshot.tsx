import { Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import PageHeader from '../../components/PageHeader';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../lib/api';

// const treeData: TreeDataNode[] = [
//   {
//     title: 'parent 1',
//     key: '0-0',
//     children: [
//       {
//         title: 'parent 1-0',
//         key: '0-0-0',
//         disabled: true,
//         children: [
//           {
//             title: 'leaf',
//             key: '0-0-0-0',
//             disableCheckbox: true,
//           },
//           {
//             title: 'leaf',
//             key: '0-0-0-1',
//           },
//         ],
//       },
//       {
//         title: 'parent 1-1',
//         key: '0-0-1',
//         children: [{ title: <span style={{ color: '#1677ff' }}>sss</span>, key: '0-0-1-0' }],
//       },
//     ],
//   },
// ];

export default function Snapshot() {
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  // const [selectedKeys, setSelectedKeys] = useState<string[]>(['0-0-1']);

  useEffect(() => {
    axiosInstance.get('/api/snapshots')
      .then((response) => {
        setTreeData(response.data);
      })
  }, [])

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };

  function onLoadData(treeNode: TreeDataNode): Promise<void> {
    console.log('onLoadData', treeNode);
    return new Promise<void>((resolve) => {
      if (treeNode.children) {
        resolve();
        return;
      }

      axiosInstance.get(`/api/snapshots?directory=${treeNode.key}`)
        .then((response) => {
          setTreeData((prev) => {
            const newTreeData = [...prev];
            const index = newTreeData.findIndex((node) => node.key === treeNode.key);
            if (index !== -1) {
              newTreeData[index] = {
                ...newTreeData[index],
                children: response.data,
              };
            }
            return newTreeData;
          });
          resolve();
        })
        .catch(() => {
          resolve();
        });
    });
  }

  return (
    <>
      <PageHeader title="Snapshot">
      </PageHeader>

      <div className='flex gap-4'>
        <div className='w-[400px] border-1 border-gray-300 rounded-md p-4 h-[calc(100vh-220px)] overflow-y-auto'>
          <Tree
            checkable
            onSelect={onSelect}
            onCheck={onCheck}
            treeData={treeData}
            loadData={async (treeNode) => onLoadData(treeNode)}
          />
        </div>
        <div className='flex items-center justify-center w-full border-1 border-gray-300 rounded-md p-4 h-[calc(100vh-220px)]'>
          Disini nanti preview dari tree yang kita pilih
        </div>
      </div>

    </>


  );
};
