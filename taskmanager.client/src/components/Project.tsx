import { Alert, Button, Container, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { css } from "@emotion/react";
import useAsyncEffect from "use-async-effect";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../states/store";
import projectService from "../services/project.service";
import { gettingProjectsAction, gotProjectsAction } from "../states/project.state";

const Project: React.FC = () => {
    let dispatch = useDispatch();
    let state = useSelector((s: AppState) => s.projectsState);

    useAsyncEffect(async () => {
        let service: projectService = new projectService();
        dispatch(gettingProjectsAction());
        let response = await service.getAll();
        dispatch(gotProjectsAction(response));
    }, [dispatch]);

    return (
        <Container>
            <div className="d-flex">
                <div className="flex-grow-1">
                    <h1>Projects</h1>
                </div>
                <div>
                    <Button variant="primary">Add</Button>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className="w-auto">#</th>
                        <th className="w-75">Name</th>
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
                                <td>{project.CreatedDateTime.format("M/D/YYYY")}</td>
                                <td css={css`
                                    padding: 0;
                                    white-space: nowrap;
                                `}>
                                    <Link to="#" onClick={() => console.log('clicked')}>Edit</Link>&nbsp;|&nbsp;
                                    <Link to="#" onClick={() => console.log('clicked')}>Delete</Link>
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

export default Project;
