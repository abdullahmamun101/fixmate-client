
"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type User = {
  _id: string;
  name?: string;
  email: string;
  role: "customer" | "technician" | "admin";
};

const API = "http://localhost:5000";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        throw new Error("Please login first");
      }

      const response = await fetch(`${API}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load users");
      }

      setUsers(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };

    loadUsers();
  }, [fetchUsers]);

  const updateRole = async (id: string, role: User["role"]) => {
    try {
      setUpdatingId(id);

      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        throw new Error("Please login first");
      }

      const response = await fetch(`${API}/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user role");
      }

      toast.success(data.message || "User role updated");
      await fetchUsers();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setUpdatingId("");
    }
  };

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Manage Users
        </h1>
        <p className="mb-8 text-gray-500">
          View users and manage their platform roles.
        </p>

        {users.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Current Role</th>
                  <th className="px-5 py-4">Change Role</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {user.name || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={user.role}
                        disabled={updatingId === user._id}
                        onChange={(event) =>
                          updateRole(
                            user._id,
                            event.target.value as User["role"]
                          )
                        }
                        className="rounded-lg border px-3 py-2 disabled:opacity-50"
                      >
                        <option value="customer">Customer</option>
                        <option value="technician">Technician</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
