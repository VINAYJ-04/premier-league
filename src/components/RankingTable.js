import React from 'react';
import { Table, Spinner, Row, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getRanking, getRankingError, getRankingProgress } from '../selectors/rankingSelector';
import { getBackgroundColorByPosition } from '../helpers/RankingHelper';
import { Link } from 'react-router-dom';

class RankingTable extends React.PureComponent {

    renderProgress = () => {
        return (
            <Row className="justify-content-center" style={styles.container}>
                <Spinner animation="grow" />
            </Row>
        );
    };

    renderError = () => {
        const {
            error,
            refreshData
        } = this.props;

        return (
            <Row className="justify-content-center" style={styles.container}>
                <Alert variant='warning'>
                    <span className="text-center">Something went wrong: <strong>{error}</strong>. Do you want to <Alert.Link onClick={refreshData}>try again?</Alert.Link></span>
                </Alert>
            </Row>
        );
    };

    renderRow = (row, colSpan = 1, withStrong = false) => {
        return (
            <td colSpan={colSpan} style={styles.tableColumn}>{withStrong ? (<strong>{row}</strong>) : (row)}</td>
        );
    };

    renderRows = () => {
        return this.props.ranking.map((team, index) => {
            const club = (
                <Link to={`/teams/${team.id}`}>
                    <img
                        style={styles.logo}
                        src={team.logo}
                        alt={`${team.name} Logo`}
                    />
                    {team.name}
                </Link>
            );
            return (
                <tr key={index} style={{ backgroundColor: getBackgroundColorByPosition(index + 1) }}>
                    {this.renderRow(team.ranking)}
                    {this.renderRow(club, 3)}
                    {this.renderRow((team.wins + team.drawns + team.losses))}
                    {this.renderRow(team.wins)}
                    {this.renderRow(team.drawns)}
                    {this.renderRow(team.losses)}
                    {this.renderRow(team.goalsFor)}
                    {this.renderRow(team.goalsAgainst)}
                    {this.renderRow(team.goalsDifference)}
                    {this.renderRow(team.points, null, true)}
                </tr>
            );
        });
    };

    render() {

        const {
            error,
            progress,
            ranking
        } = this.props;

        if (ranking.length === 0) {
            if (error) return this.renderError();
            if (progress) return this.renderProgress();
        }

        return (
            <Table responsive size='sm'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th colSpan={3}>Club</th>
                        <th>MP</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GF</th>
                        <th>GA</th>
                        <th>GD</th>
                        <th>Pts</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </Table>
        );
    };
};

const styles = {
    logo: {
        height: 22,
        width: 22,
        marginRight: 4
    },
    container: {
        marginTop: 10,
        marginBottom: 10
    },
    tableColumn: {
        fontSize: 14,
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    }
};

const mapStateToProps = (state) => {
    return {
        ranking: getRanking(),
        error: getRankingError(),
        progress: getRankingProgress()
    };
}

export default connect(mapStateToProps)(RankingTable);