import { Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import PageHeader from '../../components/PageHeader';

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ title: <span style={{ color: '#1677ff' }}>sss</span>, key: '0-0-1-0' }],
      },
    ],
  },
];

export default function Snapshot() {
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };

  return (
    <>
      <PageHeader title="Snapshot">
      </PageHeader>

      <div className='flex gap-4'>
        <div className='w-[400px] border-1 border-gray-300 rounded-md p-4 h-[calc(100vh-220px)] overflow-y-auto'>
          <Tree
            checkable
            defaultExpandedKeys={['0-0-0', '0-0-1']}
            defaultSelectedKeys={['0-0-1']}
            defaultCheckedKeys={['0-0-0', '0-0-1']}
            onSelect={onSelect}
            onCheck={onCheck}
            treeData={treeData}
          />
        </div>
        <div className='flex items-center justify-center w-full border-1 border-gray-300 rounded-md p-4 h-[calc(100vh-220px)]'>
          Disini nanti preview dari tree yang kita pilih
        </div>
      </div>

    </>


  );
};
