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
import "../../app/globals.css";
import axios from "axios";
import { useRouter } from "next/navigation";

const { Text } = Typography;

const Dashboard = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDraftVisible, setIsDraftVisible] = useState(true);

  const [initialData, setInitialData] = useState([]);

  // Cart pagination states
  const [currentCartPage, setCurrentCartPage] = useState(1);
  const cartPageSize = 7; // Items per page in cart

  const router = useRouter()

  const fetchPartInduk = async () => {
    try {
      const response = await axios.get("api/partinduk");
      const partindukData = response.data.rows.map((row, index) => ({
        key: row.id_pi,
        nomor_pi: row.no_pi,
        nomor_pi_update: row.no_pi_update,
      }));
      setInitialData(partindukData)

    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleRowClick = async (event, record) => {
    let paramsData = "";
    try {
      const response = await axios.post('api/partinduk', {
        key: record.key,
      })

      paramsData = response?.data?.rows[0]?.no_pi
    } catch (error) {
      console.error("Error fetching data: ", error)
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
    {
      title: "No Part Induk",
      dataIndex: "nomor_pi",
    },
    {
      title: "No Part Induk Update",
      dataIndex: "nomor_pi_update",
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
      const nomorPi = (item.nomor_pi || '-').toString();
      const nomorPiUpdate = (item.nomor_pi_update || '-').toString();
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
        <Flex justify="space-between" align="center">
          <div className="text-2xl font-medium">
            <p>Daftar Part Induk</p>
          </div>
          <Badge count={cartItems.length}>
            <FileDoneOutlined
              style={{ fontSize: "24px" }}
              onClick={toggleDraftVisibility}
            />
          </Badge>
        </Flex>

        <div>
          <Input
            placeholder="Cari Nomor Part Induk"
            size="large"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            suffix={suffix}
          />
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
                rowSelection={rowSelection}
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
              />
            </Flex>
          </div>

          {/* Cart Section with Pagination */}
          {isDraftVisible && (
            <div className="grid">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "360px",
                  maxHeight: "607px",
                  minHeight: "607px",
                  gap: "16px",
                }}
                className="rounded-md shadow-sm"
              >
                <Card
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text>Draft Laporan ({cartItems.length})</Text>
                      {cartItems.length > 0 && (
                        <Button type="text" danger onClick={clearCart}>
                          Clear All
                        </Button>
                      )}
                    </div>
                  }
                  style={{
                    flex: 1,
                    maxHeight: "607px",
                    minHeight: "607px",
                  }}
                >
                  <List
                    dataSource={getPaginatedCartItems()}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeFromCart(item.key)}
                          />,
                        ]}
                      >
                        <List.Item.Meta
                          title={item.nomor_pi || '-'}
                          description={item.nomor_pi_update || '-'}
                        />
                      </List.Item>
                    )}
                    locale={{ emptyText: "Keranjang Kosong" }}
                  />
                </Card>

                {/* Pagination Selalu di Bawah */}
                {cartItems.length > cartPageSize && (
                  <div
                    style={{
                      textAlign: "right",
                      justifyItems: "end",
                    }}
                  >
                    <Pagination
                      current={currentCartPage}
                      total={cartItems.length}
                      pageSize={cartPageSize}
                      onChange={onCartPageChange}
                      size="large"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </Flex>
      </div>
    </div>
  );
};

export default Dashboard;
