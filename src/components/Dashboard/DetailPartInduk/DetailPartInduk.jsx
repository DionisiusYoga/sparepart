"use client";
import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Flex,
  Table,
  Card,
  List,
  Typography,
  Badge,
  Pagination,
  Descriptions,
  Modal,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";

import axios from "axios";
import { useRouter } from "next/navigation";

const { Text } = Typography;

const DetailPartInduk = ({ nomor }) => {
  const [searchText, setSearchText] = useState("");
  const [partId, setPartId] = useState("");
  const [noPart, setNoPart] = useState("");
  const [noPartUpdate, setNoPartUpdate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDraftVisible, setIsDraftVisible] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [initialData, setInitialData] = useState([]);

  // Cart pagination states
  const [currentCartPage, setCurrentCartPage] = useState(1);
  const cartPageSize = 7; // Items per page in cart

  const router = useRouter();

  const fetchPartInduk = async () => {
    try {
      const response = await axios.post("/api/partinduk/cek", {
        no_part_induk: nomor,
      });

      const dataLength = response?.data?.rows?.length;
      setPartId(response?.data?.rows[0]?.id_pi);
      setNoPart(response?.data?.rows[0]?.no_part);
      setNoPartUpdate(response?.data?.rows[0]?.no_part_update);

      if (dataLength === 0) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartAnak = async () => {
    console.log(partId);
    try {
      const response = await axios.post("/api/partanak", {
        id_pi: partId,
      });

      const partAnakData = response?.data?.rows?.map((row) => ({
        key: row.id_pa,
        nomor_pa: row.no_part || "-",
        nomor_pa_update: row.no_part_update || "-",
        supplier: row.nama_lokal || "-",
        maker: row.nama_maker || "-",
        remark: row.nama || "",
        no_cmw: row.no_cmw,
        dwg: row.nama_dwg,
        material: row.nama_material,
      }));
      setInitialData(partAnakData || []);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setInitialData([]); // Ensure array even on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartInduk();
  }, [nomor]); // Add dependency to prevent infinite loop

  useEffect(() => {
    if (partId) {
      fetchPartAnak();
    }
  }, [partId]); // Only run when partId changes

  const handleRowClick = (record) => {
    console.log("Selected Record:", record);
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const columns = [
    // {
    //   title: "No.",
    //   dataIndex: "no",
    //   width: 10,
    // },
    {
      title: "No Part Anak",
      dataIndex: "nomor_pa",
    },
    {
      title: "No Part Anak Update",
      dataIndex: "nomor_pa_update",
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
    },
    {
      title: "Maker",
      dataIndex: "maker",
    },
    {
      title: "Remark",
      dataIndex: "remark",
    },
  ];

  // const columns = [
  //   {
  //     title: "No Part Anak",
  //     dataIndex: "nomor_pa",
  //   },
  //   {
  //     title: "No Part Anak Update",
  //     dataIndex: "nomor_pa_update",
  //   },
  //   {
  //     title: "No CMW",
  //     dataIndex: "no_cmw",
  //   },
  //   {
  //     title: "Supplier",
  //     dataIndex: "supplier",
  //   },
  //   {
  //     title: "Maker",
  //     dataIndex: "maker",
  //   },
  //   {
  //     title: "Drawing",
  //     dataIndex: "dwg",
  //   },
  //   {
  //     title: "Material",
  //     dataIndex: "material",
  //   },
  //   {
  //     title: "Remark",
  //     dataIndex: "remark",
  //   },
  // ];

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchText(value);

    if (!value) {
      setFilteredData(initialData);
      return;
    }

    const filtered = initialData.filter((item) => {
      // Pastikan nilai tidak null/undefined sebelum konversi ke string
      const nomorPi = (item.nomor_pa || "-").toString();
      const nomorPiUpdate = (item.nomor_pa_update || "-").toString();
      const searchValue = value.toString();

      return (
        nomorPi.toLowerCase().includes(searchValue.toLowerCase()) ||
        nomorPiUpdate.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    setFilteredData(filtered);
  };

  // Initialize filtered data
  useEffect(() => {
    setFilteredData(initialData);
  }, []); // Effect untuk fetch data awal

  // Tambahkan effect baru untuk update filteredData
  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  // Handle row selection with improved uncheck handling
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    const uncheckedKeys = selectedRowKeys.filter(
      (key) => !newSelectedRowKeys.includes(key)
    );

    setSelectedRowKeys(newSelectedRowKeys);

    if (uncheckedKeys.length > 0) {
      setCartItems((prevCartItems) =>
        prevCartItems.filter((item) => !uncheckedKeys.includes(item.key))
      );
    }

    const newItems = selectedRows.filter(
      (row) => !cartItems.some((cartItem) => cartItem.key === row.key)
    );

    if (newItems.length > 0) {
      setCartItems((prevCartItems) => [...prevCartItems, ...newItems]);
      // Reset to first page when new items are added
      setCurrentCartPage(1);
    }
  };

  const suffix = (
    <SearchOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );

  return (
    <div className="max-w-screen-xl">
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-medium">
            <p>Informasi Part Induk</p>
          </div>
          <button
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md"
            onClick={() => router.back()} // Pastikan router diimpor jika menggunakan Next.js
          >
            Kembali
          </button>
        </div>

        <div>
          <Input
            placeholder="Cari no part anak"
            size="large"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            suffix={suffix}
            // className="shadow-md"
          />
        </div>

        <div className="flex gap-8 mb-2 p-4 bg-white rounded-md border border-gray-200">
          <div className="grid">
            <div className="text-sm text-gray-500">Nomor Part Induk</div>
            <div className="font-bold text-lg text-gray-800">
              {noPart || "-"}
            </div>
          </div>
          <div className="grid">
            <div className="text-sm text-gray-500">Nomor Part Induk Update</div>
            <div className="font-bold text-lg text-gray-800">
              {noPartUpdate || "-"}
            </div>
          </div>
        </div>

        <Flex gap="large">
          {/* Table Section */}
          <div style={{ flex: 2 }}>
            <Flex gap="middle" vertical>
              {/* <Flex align="center" gap="middle">
                <Button
                  type="primary"
                  onClick={start}
                  disabled={!hasSelected}
                  loading={loading}
                >
                  Export selected data
                </Button>
                {hasSelected
                  ? `Selected ${selectedRowKeys.length} items`
                  : null}
              </Flex> */}
              <Table
                // rowSelection={rowSelection}
                columns={columns}
                dataSource={filteredData}
                pagination={{
                  position: ["bottomRight"],
                  responsive: true,
                }}
                size="large"
                bordered={true}
                onRow={(record) => ({
                  onClick: (e) => handleRowClick(record),
                  style: { cursor: "pointer" },
                })}
                loading={loading}
              />
              <Modal
                title="Detail Part Anak"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                width={600}
                bodyStyle={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                }}
                footer={[
                  <Button key="close" onClick={() => setIsModalVisible(false)}>
                    Close
                  </Button>,
                ]}
              >
                {selectedRow && (
                  <Descriptions
                    layout="vertical"
                    bordered
                    column={{ xs: 1, sm: 2, md: 2 }}
                    style={{
                      marginTop: "20px",
                      backgroundColor: "white",
                      padding: "20px",
                      borderRadius: "8px",
                    }}
                  >
                    <Descriptions.Item label="No Part Anak" span={2}>
                      <strong>{selectedRow.nomor_pa || "-"}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="No Part Anak Update" span={2}>
                      <strong>{selectedRow.nomor_pa_update || "-"}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="No CMW" span={3}>
                      {selectedRow.no_cmw || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Supplier" span={1}>
                      {selectedRow.supplier || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Maker" span={1}>
                      {selectedRow.maker || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Drawing" span={1}>
                      {selectedRow.dwg || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Material" span={2}>
                      {selectedRow.material || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Remark" span={2}>
                      {selectedRow.remark || "-"}
                    </Descriptions.Item>
                  </Descriptions>
                )}
              </Modal>
            </Flex>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default DetailPartInduk;
