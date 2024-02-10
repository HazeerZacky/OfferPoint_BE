import React,{useState} from "react";
import { BreadCrumb } from "../../../components/breadcrumb";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { CategoryListing } from "../../category/pages/category.listing";
import { UserListing } from "../../auth/pages/user.listing";
import { AdvertisementListing } from "../../advertisement/pages/advertisement.page";
import { useAuth } from "../../../core/hooks/useAuth";
import { ContactListing } from "../../contact/pages/contact.listing";

const TAB_KEY = Object.freeze({
    CATEGORY: 1,
    USER: 2,
    ADVERTISEMENT: 3,
    CONTACT: 4
});

export const DashboardPage = ()=>{
    const [key, setKey] = useState(TAB_KEY.USER);
    const {isAdmin} = useAuth();
    const onChangeKey = (k)=>{
        setKey(k)
    }

    return (
        <div>

            <div class="page-section">
                <div class="container">
                    <div className="row">

                        <div className="col-md-12">
                            <Tabs activeKey={key} transition={false} onSelect={onChangeKey}>
                                <Tab eventKey={TAB_KEY.USER} title="Users" className="p-3">
                                    {key == TAB_KEY.USER && <UserListing/>}
                                </Tab>
                                <Tab eventKey={TAB_KEY.CATEGORY} title="Categories" className="p-3">
                                    {key == TAB_KEY.CATEGORY && <CategoryListing/>}
                                </Tab>
                                {isAdmin() &&
                                    <Tab eventKey={TAB_KEY.CONTACT} title="Messages" className="p-3">
                                        {key == TAB_KEY.CONTACT && <ContactListing/>}
                                    </Tab>
                                }
                                {isAdmin() &&
                                    <Tab eventKey={TAB_KEY.ADVERTISEMENT} title="Advertisement" className="p-3">
                                        {key == TAB_KEY.ADVERTISEMENT && <AdvertisementListing/>}
                                    </Tab>
                                }
                            </Tabs>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}