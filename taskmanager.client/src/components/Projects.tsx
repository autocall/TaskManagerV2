import { Alert, Button, Container, Modal, Spinner, Table } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { css } from "@emotion/react";
import useAsyncEffect from "use-async-effect";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../states/store";
import projectService from "../services/project.service";
import { useState } from "react";
import ProjectModal from "./Project.Modal";
import ProjectModel from "../services/models/project.model";
import { gettingProjectsAction, gotProjectsAction, deletingProjectAction, deletedProjectAction } from "../states/projects.state";
import { useConfirm } from "./shared/confirm";
import { testHelper } from "../helpers/test.helper";
import stringExtension from "../extensions/string.extension";

const Projects: React.FC = () => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    let state = useSelector((s: AppState) => s.projectsState);
    const [modalData, setModalData] = useState<ProjectModel | null>(null);
    const { confirm, ConfirmDialog } = useConfirm();

    useAsyncEffect(async () => {
        await load();
    }, [dispatch]);

    const load = async () => {
        let service: projectService = new projectService(testHelper.getTestContainer(search));
        dispatch(gettingProjectsAction());
        let response = await service.getAll();
        dispatch(gotProjectsAction(response));
    };
    const handleAdd = () => setModalData(new ProjectModel());
    const handleEdit = (model: ProjectModel) => setModalData(model);
    const handleDelete = async (model: ProjectModel) => {
        if (await confirm("Delete Project", `Are you sure you want to delete the project '${model.Name}'?`)) {
            let service: projectService = new projectService(testHelper.getTestContainer(search));
            dispatch(deletingProjectAction());
            let response = await service.delete(model.Id);
            dispatch(deletedProjectAction(response));
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
        <Container className="scroll-content">
            {ConfirmDialog}
            <ProjectModal modalData={modalData} onClose={handleClose} />
            <div className="d-flex">
                <div className="flex-grow-1">
                    <h1>Projects</h1>
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
                        <th className="w-75">Default Column</th>
                        <th className="w-25">Created</th>
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
                        state.projects?.map((project) => (
                            <tr key={project.Id}>
                                <td>{project.Id}</td>
                                <td>{project.Name}</td>
                                <td>{project.DefaultColumn}</td>
                                <td>{stringExtension.dateToShort(project.CreatedDateTime)}</td>
                                <td
                                    css={css`
                                        padding: 0;
                                        white-space: nowrap;
                                    `}>
                                    <Link to="#" onClick={() => handleEdit(project)}>
                                        Edit
                                    </Link>
                                    &nbsp;|&nbsp;
                                    <Link to="#" onClick={() => handleDelete(project)}>
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

export default Projects;
