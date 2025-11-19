const API_BASE = "http://localhost:8080/api/refunds";

export const createRefundRequest = async (refundData, token) => {
  const res = await fetch(`${API_BASE}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(refundData),
  });

  return res.json();
};

export const getMyRefunds = async (token) => {
  const res = await fetch(`${API_BASE}/my-refunds`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export async function getAllRefunds(token) {
  try {
    const res = await fetch(`${API_BASE}/admin/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    console.error("getAllRefunds error:", err);
    return { success: false, error: err.message };
  }
}
export async function processRefund(refund_Id, payload, token) {
  try {
    console.log("Calling processRefund for:", refund_Id);

    const res = await fetch(`${API_BASE}/admin/process/${refund_Id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log("Fetch completed, status:", res.status);
    const text = await res.text();
    console.log("Raw response text:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      return { success: false, error: "Server returned non-JSON response" };
    }

    return data;
  } catch (err) {
    console.error("Network error:", err);
    return { success: false, error: err.message };
  }
}

export const getRefundDetails = async (id, token) => {
  const res = await fetch(`${API_BASE}/admin/details/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json(); // should return { success: true, refund: {...}, booking: {...} }
};
