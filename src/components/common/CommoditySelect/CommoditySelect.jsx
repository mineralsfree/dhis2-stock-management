import React, {useState} from "react";
import styles from "./CommoditySelect.module.css";
import {
    DropdownButton,
    FlyoutMenu,
    MenuItem,
    MenuSectionHeader
} from '@dhis2/ui'

export const CommoditySelect = (props) => {
    const [commodityDropDownOpen, setCommodityDropDownOpen] = useState(false);
    const {selectedCommodity, setSelectedCommodity, options} = props
    return (<DropdownButton
        large
        open={commodityDropDownOpen}
        component={
            <FlyoutMenu>
                {Object.keys(options).map(type => {
                        return (<><MenuSectionHeader label={type} key={type}></MenuSectionHeader>
                            {options[type].map(commodity => {
                                return (<MenuItem value={commodity}
                                                  onClick={e => {
                                                      setSelectedCommodity(e.value);
                                                      setCommodityDropDownOpen((open) => !open)
                                                  }}
                                                  icon={<span>{commodity.value}</span>}
                                                  label={commodity.displayName}
                                                  key={commodity.displayName}/>)
                            })}
                        </>)
                    }
                )}

            </FlyoutMenu>
        }
        label="Amount"
        name="amount"
        className={styles.commodity_selection_input}
        onClick={() => setCommodityDropDownOpen((open) => !open)}
    >{selectedCommodity ? `${selectedCommodity.value} - ${selectedCommodity.displayName}` : "Select commodity"}
    </DropdownButton>)
}