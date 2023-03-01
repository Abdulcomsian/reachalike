import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import RatingChat from "../layouts/rating-chat";

const ConfirmationModal = (props) => {
  const navigate = useNavigate();
  const [yes, setYes] = React.useState(false);
  const ref = React.useRef();
  const [ratingModal, setRatingModal] = React.useState(false);

  // useEffect(() => {
  //   const unlisten = navigate((location) => location.pathname);

  //   return () => {
  //     unlisten();
  //   };
  // }, [navigate]);

  function handleRedirect() {
    navigate("/");
  }

  const onClickYes = () => {
    setYes(true);
  };

  const onClickConfirm = () => {
    setRatingModal(true);
    setYes(false);
    props.onClickEndConfirmBtn();
    props.setConfirm(false);
  };

  const modalUserRatingClose = (val) => {
    props.setConfirm(false);
    props.modalUserRatingClose();
    handleRedirect();
  };

  return (
    <>
      <Modal isOpen={props.confirm} toggle={props.toggleModal}>
        <ModalHeader toggle={props.toggleModal}>Confirmation</ModalHeader>
        <ModalBody>Are you sure you want to leave this converstion?</ModalBody>
        <ModalFooter>
          <Button
            color={yes ? "danger" : "warning"}
            className="px-4"
            onClick={yes ? onClickConfirm : onClickYes}
          >
            {yes ? "Confirm" : "Yes"}
          </Button>{" "}
          <Button color="success" className="px-4" onClick={props.toggleModal}>
            No
          </Button>
        </ModalFooter>
      </Modal>
      {ratingModal && (
        <RatingChat
          setRatingModal={setRatingModal}
          asRef={ref}
          modalUserRatingClose={modalUserRatingClose}
          loginHandler={props.loginHandler}
          registerHandler={props.registerHandler}
        />
      )}
    </>
  );
};

export default ConfirmationModal;
