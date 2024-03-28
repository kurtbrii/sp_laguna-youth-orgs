/* eslint-disable @typescript-eslint/no-explicit-any */

const DeleteModal = ({
  toggleModal,
  handleToggleButton,
  handleDeleteButton,
  string,
}: any) => {
  return (
    <>
      {toggleModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-700 bg-opacity-80">
          <div className="rounded-md bg-white p-12">
            <p className="mb-6 font-bold">
              Do you want to delete this {string}?
            </p>
            <div className=" flex justify-center">
              <button
                className="rounded-mdpx-4 btn-outline mr-3 px-5 py-2"
                style={{ color: "var(--red)", borderColor: "var(--red)" }}
                onClick={handleToggleButton}
              >
                Cancel
              </button>
              <button
                className="btn-active rounded-md px-4 py-2 text-white focus:outline-none focus:ring"
                onClick={handleDeleteButton}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
