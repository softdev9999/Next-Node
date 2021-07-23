import React from "react";

class ErrorBoundary extends React.Component {
    componentDidCatch(error, info) {
        console.warn(error, info);
        this.props.onError();
    }

    render() {
        return this.props.children;
    }
}

export default ErrorBoundary;
