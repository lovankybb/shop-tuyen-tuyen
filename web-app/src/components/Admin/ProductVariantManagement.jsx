import { useState } from "react";
import ConfirmPopup from "../Popup/ConfirmPopup";
import ErrorPopup from "../Popup/ErrorPopup";
import SuccessPopup from "../Popup/SuccessPopup";
import "./ProductVariantManagement.css";

const ProductVariantManagement = ({ productId }) => {
  const [variants, setVariants] = useState([]);

  const [successPopupOpen, setSuccessPopupOpen] = useState(false);
  const [confirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);

  // State to manage custom Popup and Confirm dialogs

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  };

  const handleAddVariant = (e) => {
    e.preventDefault();
  };

  

  return (
    <div className="variant-manage-container">
      <h2>Manage Product Variants</h2>

      {/* Variants Data Table */}
      <div className="table-responsive">
        <table className="variant-table">
          <thead>
            <tr>
              <th>Color</th>
              <th>Version</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {variants.length > 0 ? (
              variants.map((variant) => (
                <tr key={variant.id}>
                  <td>{variant.color}</td>
                  <td>{variant.version}</td>
                  <td>
                    <input
                      type="text"
                      value={variant.price}
                      onChange={(e) => handlePriceChange(variant.id, e)}
                    />
                  </td>
                  <td>{variant.stock}</td>
                  <td>
                    <button className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No variants found for this product.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Alert / Information Popup */}
      <SuccessPopup
        isOpen={successPopupOpen}
        message="Variant added successfully!"
        onClose={() => setSuccessPopupOpen(false)}
      />
      <ErrorPopup
        isOpen={errorPopupOpen}
        message="Failed to add variant."
        onClose={() => setErrorPopupOpen(false)}
      />

      {/* Custom Confirmation Dialog */}
      <ConfirmPopup
        isOpen={confirmPopupOpen}
        message="Are you sure you want to delete this variant? This action cannot be undone."
        onConfirm={() => {
          // Implementation for delete confirmation
        }}
        onCancel={() => {
          setConfirmPopupOpen(false);
        }}
      />
    </div>
  );
};

export default ProductVariantManagement;
