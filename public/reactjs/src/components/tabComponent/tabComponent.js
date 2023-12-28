import React from "react";

const Tab = ({ tabs, activeTab, handleTabClick, tabContent }) => {
    const styles = {
        tabRow: {
            display: "flex",
            paddingLeft: "12px",
            paddingTop: "6px",
            backgroundColor: "#fafafa",
            borderRadius: "16px 16px 0 0",
            margin: "0 auto",
            width: "96%",
            maxWidth: "90vw",
            minWidth: "510px",
        },
        tab: {
            textAlign: "center",
            padding: "12px",
            marginRight: "10px",
            cursor: "pointer",
            position: "relative",
        },
        tabSpan: {
            display: "inline-block",
            position: "relative",
        },
        tabSpanBefore: {
            content: '""',
            position: "absolute",
            top: "35px",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "2px",
            backgroundColor: "blue",
            transform: "scaleX(0)",
            transformOrigin: "bottom left",
            transition: "transform 0.2s ease-in-out",
        },

        activeTabSpanBefore: {
            transform: "scaleX(1)",
        },
        activeTab: {
            color: "blue",
        },
        historyDetailsBox: {
            display: "grid",
            gridTemplateRows: "50% 50%",
            backgroundColor: "#fafafa",
            borderRadius: "0 0 16px 16px",
            width: "96%",
            maxWidth: "90vw",
            margin: "0 auto",
            paddingBottom: "1%",
            overflowX: "auto",
            boxSizing: "border-box",
            minWidth: "510px",
            marginBottom: "10px",
        },
    }

    return (
        <div>
            <div style={styles.tabRow}>
                {tabs.map((tab) => (
                    <div
                        key={tab}
                        style={{
                            ...styles.tab,
                            ...(activeTab === tab && styles.activeTab),
                        }}
                        onClick={() => handleTabClick(tab)}
                    >
                        <span style={styles.tabSpan}>
                            {tab}
                            <span
                                style={{
                                    ...styles.tabSpanBefore,
                                    ...(activeTab === tab && styles.activeTabSpanBefore),
                                }}
                            ></span>
                        </span>
                    </div>
                ))}
            </div>
            <div style={styles.historyDetailsBox}>{tabContent}</div>
        </div>
    );
};

export default Tab;
