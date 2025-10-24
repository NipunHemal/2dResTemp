import React, { useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import useRestaurantStore from "@/lib/stores/restaurant-store";
import ComponentSidebar from "../ComponentSidebar";
import RestaurantCanvas from "../RestaurantCanvas";
import AdminToolbar from "../AdminToolbar";
import { RestaurantLayout } from "@/types/restaurant";

const Create2DMap = ({
  open,
  setOpen,
  triggerRefish,
  isEdit = false,
  mapObject = null,
}: {
  open: any;
  setOpen: any;
  triggerRefish: any;
  isEdit?: boolean;
  mapObject?: RestaurantLayout | null;
}) => {
  const { currentLayout, createNewLayout } = useRestaurantStore();

  useEffect(() => {
    if (!currentLayout) {
      createNewLayout();
    }
  }, [currentLayout, createNewLayout]);

  const [dialogOpen, setDialogOpen] = React.useState(true);

  useEffect(() => {
    setDialogOpen(open);
  }, [open]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setOpen(false);
  };

  if (!dialogOpen) return null;

  return (
    <div className="fixed left-0 z-[400] flex justify-center items-center top-0 bg-opacity-80 md:p-2 lg:p-5 bg-black overflow-auto w-full h-full">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 150 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ delay: 0.15 }}
          className={` h-full w-full overflow-y-auto overflow-x-auto flex p-2 mx-5 flex-col items-center bg-gray-50 rounded-lg lg:rounded-2xl opacity-100 border`}
        >
          <div className="flex w-full lg:pr-0 pr-4 lg:pt-0 pt-4 justify-end">
            <button onClick={handleDialogClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="h-screen bg-gray-100 flex w-full overflow-auto">
            <ComponentSidebar />
            <RestaurantCanvas />
            <AdminToolbar
              triggerRefish={triggerRefish}
              mapObj={isEdit ? mapObject : null}
              isEdit={isEdit}
              handelClose={handleDialogClose}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Create2DMap;
