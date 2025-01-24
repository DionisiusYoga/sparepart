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
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDraftVisible, setIsDraftVisible] = useState(true);

  const [initialData, setInitialData] = useState([]);

  // Cart pagination states
  const [currentCartPage, setCurrentCartPage] = useState(1);
  const cartPageSize = 7; // Items per page in cart

  const router = useRouter();

  const fetchPartInduk = async () => {
    try {
      const response = await axios.get("api/partanak");
      const partAnakData = response?.data?.rows?.map((row, index) => ({
        key: row.id_pa,
        nomor_pa: row.no_part,
        nomor_pa_update: row.no_part_update,
        supplier: id_dwg,
        maker: id_maker,
      }));
      setInitialData(partAnakData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (event, record) => {
    let paramsData = "";
    try {
      const response = await axios.post("api/partinduk", {
        key: record.key,
      });

      paramsData = response?.data?.rows[0]?.no_pi;
    } catch (error) {
      console.error("Error fetching data: ", error);
    }

    const isCheckbox =
      event.target.tagName === "INPUT" && event.target.type === "checkbox";
    const isCheckboxCell = event.target.className.includes(
      "ant-table-cell-with-append"
    );

    if (!isCheckbox && !isCheckboxCell) {
      router.push(`/detail/${paramsData}`);
    }
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

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchText(value);

    if (!value) {
      setFilteredData(initialData);
      return;
    }

    const filtered = initialData.filter((item) => {
      // Pastikan nilai tidak null/undefined sebelum konversi ke string
      const nomorPi = (item.nomor_pi || "-").toString();
      const nomorPiUpdate = (item.nomor_pi_update || "-").toString();
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
    fetchPartInduk();
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

  // Remove item from cart
  const removeFromCart = (itemKey) => {
    setCartItems(cartItems.filter((item) => item.key !== itemKey));
    setSelectedRowKeys(selectedRowKeys.filter((key) => key !== itemKey));

    // Adjust current page if necessary after removal
    const totalPages = Math.ceil((cartItems.length - 1) / cartPageSize);
    if (currentCartPage > totalPages && totalPages > 0) {
      setCurrentCartPage(totalPages);
    }
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    setSelectedRowKeys([]);
    setCurrentCartPage(1);
  };

  // Calculate paginated cart items
  const getPaginatedCartItems = () => {
    const startIndex = (currentCartPage - 1) * cartPageSize;
    return cartItems.slice(startIndex, startIndex + cartPageSize);
  };

  const onCartPageChange = (page) => {
    setCurrentCartPage(page);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const toggleDraftVisibility = () => {
    setIsDraftVisible(!isDraftVisible);
  };

  const hasSelected = selectedRowKeys.length > 0;

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
        <div>
          <Input
            placeholder="Cari Nomor Part Anak"
            size="large"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            suffix={suffix}
          />
        </div>
        <Flex justify="space-between" align="center">
          <div className="text-2xl font-medium">
            <p>Informasi Part Induk</p>
          </div>
        </Flex>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "310px",
            }}
          >
            <span>Nomor Part Induk</span>
            <span>
              : <span style={{ fontWeight: "bold" }}>{nomor}</span>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "310px",
            }}
          >
            <span>Nomor Part Induk Update</span>
            <span className="">
              : <span style={{ fontWeight: "bold" }}>{nomor}</span>
            </span>
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
                  onClick: (e) => handleRowClick(e, record),
                  style: { cursor: "pointer" },
                })}
                loading={loading}
              />
            </Flex>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default DetailPartInduk;
