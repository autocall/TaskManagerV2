import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

export const useConfirm = () => {
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string | null>("");
    const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => {});

    const confirm = (title: string, description: string) =>
        new Promise((resolve) => {
            setTitle(title);
            setDescription(description);
            setShow(true);
            setResolvePromise(() => resolve);
        });

    const handleClose = () => {
        setShow(false);
        resolvePromise(false);
    };

    const handleConfirm = () => {
        setShow(false);
        resolvePromise(true);
    };

    const ConfirmDialog = (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{description}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return { confirm, ConfirmDialog };
};
