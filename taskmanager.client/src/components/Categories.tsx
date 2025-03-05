import { Alert, Button, Container, Modal, Spinner, Table } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { css } from "@emotion/react";
import useAsyncEffect from "use-async-effect";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../states/store";
import categoryService from "../services/category.service";
import { useState } from "react";
import CategoryModal from "./Category.Modal";
import CategoryModel from "../services/models/category.model";
import { gettingCategoriesAction, gotCategoriesAction, deletingCategoryAction, deletedCategoryAction } from "../states/categories.state";
import { useConfirm } from "./shared/confirm";
import { testHelper } from "../helpers/test.helper";

const Categories: React.FC = () => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    let state = useSelector((s: AppState) => s.categoriesState);
    const [modalData, setModalData] = useState<CategoryModel | null>(null);
    const { confirm, ConfirmDialog } = useConfirm();

    useAsyncEffect(async () => {
        await load();
    }, [dispatch]);

    const load = async () => {
        let service: categoryService = new categoryService(testHelper.getTestContainer(search));
        dispatch(gettingCategoriesAction());
        let response = await service.getAll();
        dispatch(gotCategoriesAction(response));
    };
    const handleAdd = () => setModalData(new CategoryModel());
    const handleEdit = (model: CategoryModel) => setModalData(model);
    const handleUp = async (model: CategoryModel) => {
        let service: categoryService = new categoryService(testHelper.getTestContainer(search));
        dispatch(deletingCategoryAction());
        let response = await service.updateOrder(model.Id, +1);
        dispatch(deletedCategoryAction(response));
        if (response.success) {
            await load();
        }
    };
    const handleDown = async (model: CategoryModel) => {
        let service: categoryService = new categoryService(testHelper.getTestContainer(search));
        dispatch(deletingCategoryAction());
        let response = await service.updateOrder(model.Id, -1);
        dispatch(deletedCategoryAction(response));
        if (response.success) {
            await load();
        }
    };
    const handleDelete = async (model: CategoryModel) => {
        if (await confirm("Delete Category", `Are you sure you want to delete the category '${model.Name}'?`)) {
            let service: categoryService = new categoryService(testHelper.getTestContainer(search));
            dispatch(deletingCategoryAction());
            let response = await service.delete(model.Id);
            dispatch(deletedCategoryAction(response));
            if (response.success) {
                await load();
            }
        }
    };
    const handleClose = async (reload: boolean) => {
        setModalData(null);
        if (reload) {
            await load();
        }
    };

    return (
        <Container>
            {ConfirmDialog}
            <CategoryModal modalData={modalData} onClose={handleClose} />
            <div className="d-flex">
                <div className="flex-grow-1">
                    <h1>Categories</h1>
                </div>
                <div>
                    <Button variant="primary" onClick={handleAdd}>
                        Add
                    </Button>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className="w-auto">#</th>
                        <th className="w-75">Name</th>
                        <th className="w-75">Color</th>
                        <th className="w-25">Created</th>
                        <th className="w-auto">Order</th>
                        <th className="w-auto"></th>
                    </tr>
                </thead>
                <tbody>
                    {state.loading ? (
                        <tr style={{ textAlign: "center" }}>
                            <td colSpan={10}>
                                <Spinner animation="border" />
                            </td>
                        </tr>
                    ) : (
                        state.categories?.map((category) => (
                            <tr key={category.Id}>
                                <td style={{ color: category.Color }}>{category.Id}</td>
                                <td style={{ color: category.Color }}>{category.Name}</td>
                                <td style={{ color: category.Color }}>{category.Color}</td>
                                <td style={{ color: category.Color }}>{category.CreatedDateTime.format("M/D/YYYY")}</td>
                                <td
                                    css={css`
                                        padding: 0;
                                        white-space: nowrap;
                                    `}>
                                    <Link to="#" onClick={() => handleUp(category)}>
                                        ↑ Up
                                    </Link>
                                    &nbsp;|&nbsp;
                                    <Link to="#" onClick={() => handleDown(category)}>
                                        Down ↓
                                    </Link>
                                </td>
                                <td
                                    css={css`
                                        padding: 0;
                                        white-space: nowrap;
                                    `}>
                                    <Link to="#" onClick={() => handleEdit(category)}>
                                        Edit
                                    </Link>
                                    &nbsp;|&nbsp;
                                    <Link to="#" onClick={() => handleDelete(category)}>
                                        Delete
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
            {state.error && <Alert variant="danger">{state.error}</Alert>}
        </Container>
    );
};

export default Categories;
