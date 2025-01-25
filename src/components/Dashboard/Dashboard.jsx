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
  const [loading, setLoading] = useState(true);
  const [isDraftVisible, setIsDraftVisible] = useState(true);

  const [initialData, setInitialData] = useState([]);

  // Cart pagination states
  const [currentCartPage, setCurrentCartPage] = useState(1);
  const cartPageSize = 4; // Items per page in cart

  const router = useRouter();

  const fetchPartInduk = async () => {
    try {
      const response = await axios.get("/api/partinduk");
      const partindukData = response.data.rows.map((row, index) => ({
        key: row.id_pi,
        nomor_pi: row.no_part,
        nomor_pi_update: row.no_part_update,
      }));
      setInitialData(partindukData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDraftLaporan = async () => {
    try {
      const response = await axios.get("/api/draftlaporan");
      setCartItems(response.data.rows);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDraftLaporan();
  }, []);

  const handleRowClick = async (event, record) => {
    let paramsData = "";
    try {
      const response = await axios.post("/api/partinduk", {
        key: record.key,
      });

      paramsData = response?.data?.rows[0]?.no_part;
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
    {
      title: "No Part Induk",
      dataIndex: "nomor_pi",
    },
    {
      title: "No Part Induk Update",
      dataIndex: "nomor_pi_update",
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);

    if (!value) {
      setFilteredData(initialData);
      return;
    }

    const filtered = initialData.filter((item) => {
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

  useEffect(() => {
    setFilteredData(initialData);
    fetchPartInduk();
  }, []); // Effect untuk fetch data awal

  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);

  const removeFromCart = async (itemKey) => {
    try {
      const response = await axios.post("/api/draftlaporan/hapus", {
        id_draft: itemKey,
      });

      if (response.status == 200) {
        fetchDraftLaporan();
      }

      const totalPages = Math.ceil((cartItems.length - 1) / cartPageSize);
      if (currentCartPage > totalPages && totalPages > 0) {
        setCurrentCartPage(totalPages);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await axios.post("/api/draftlaporan/hapus", {
        id_draft: "clear",
      });

      if (response.status == 200) {
        fetchDraftLaporan();
      }

      const totalPages = Math.ceil((cartItems.length - 1) / cartPageSize);
      if (currentCartPage > totalPages && totalPages > 0) {
        setCurrentCartPage(totalPages);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
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

  const toggleDraftVisibility = () => {
    setIsDraftVisible(!isDraftVisible);
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
                        <div>
                          <Button type="text" danger onClick={clearCart}>
                            Clear All
                          </Button>
                        </div>
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
                            onClick={() => removeFromCart(item.id_draft)}
                          />,
                        ]}
                      >
                        <List.Item.Meta
                          title={
                            item.no_part ? (
                              <div className="grid">
                                <div>No Part</div>
                                <div className="font-bold">{item.no_part}</div>
                              </div>
                            ) : (
                              <div className="grid">
                                <div>No Part Update</div>
                                <div className="font-bold">-</div>
                              </div>
                            )
                          }
                          description={
                            item.no_part_update ? (
                              <div className="grid">
                                <div>No Part Update</div>
                                <div className="font-bold">
                                  {item.no_part_update}
                                </div>
                              </div>
                            ) : (
                              <div className="grid">
                                <div>No Part Update</div>
                                <div className="font-bold">-</div>
                              </div>
                            )
                          }
                        />
                      </List.Item>
                    )}
                    locale={{
                      emptyText: "Pilih part yang akan dijadikan laporan",
                    }}
                    loading={loading}
                  />
                  <Button className="w-full mt-2 bg-blue-500 text-white">
                    Export laporan
                  </Button>
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
