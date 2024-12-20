"use client";
import React, { useState } from "react";
import { Input, Button, Flex, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "../../app/globals.css";
const suffix = (
  <SearchOutlined
    style={{
      fontSize: 16,
      color: "#1677ff",
    }}
  />
);

const Dashboard = () => {
  const columns = [
    {
      title: "No Part Induk",
      dataIndex: "name",
    },
    {
      title: "No Part Induk Update",
      dataIndex: "age",
    },
    // {
    //   title: "Address",
    //   dataIndex: "address",
    // },
  ];
  const dataSource = Array.from({
    length: 46,
  }).map((_, i) => ({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  }));

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    // selections: [Table.SELECTION_ALL],
  };
  const hasSelected = selectedRowKeys.length > 0;

  const onSearch = (value) => {
    console.log(value);
  };

  return (
    <div className="max-w-screen-xl">
      <div className="grid gap-4">
        <div className="text-2xl font-medium">
          <p>Daftar Part Induk</p>
        </div>
        <div>
          <Input
            placeholder="Cari Nomor Part Induk"
            size="large"
            onChange={(e) => onSearch(e.target.value)}
            suffix={suffix}
          />
        </div>

        <div>
          <Flex gap="middle" vertical>
            <Flex align="center" gap="middle">
              <Button
                type="primary"
                onClick={start}
                disabled={!hasSelected}
                loading={loading}
              >
                Export selected data
              </Button>
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
            </Flex>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={dataSource}
              pagination={{
                position: ["bottomRight"],
                responsive: true,
              }}
              size="large"
              bordered={true}
            />
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
