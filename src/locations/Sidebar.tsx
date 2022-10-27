import React from 'react';
import {SidebarExtensionSDK} from '@contentful/app-sdk';
import {IdsAPI} from "@contentful/app-sdk/dist/types/api.types";
import {Button} from '@contentful/f36-components';

interface SidebarProps {
    sdk: SidebarExtensionSDK;
}

interface PublishEntryPayload {
    spaceId: string,
    contentType: string,
    entryId: string,
    organization: string,
    userId: string,
    environment: string
}

const Sidebar = (props: SidebarProps) => {
    const {sdk} = props;

    const currentEntryId = sdk.ids;
    const payload = createPayload(currentEntryId);

    function triggerPublishingEntry(payload: PublishEntryPayload) {
        const url = sdk.parameters.instance.webhookTriggerPublisherUrl;
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });
    }

    function openModal() {
        sdk.dialogs
            .openConfirm({
                title: 'Are you sure?',
                message: 'Do you really want to publish this entry and all related entities?' +
                    ' It can take a few minutes...',
                intent: 'positive',
                confirmLabel: 'Confirm',
                cancelLabel: 'Cancel',
            })
            .then((result) => {
                if (result) {
                    triggerPublishingEntry(payload)
                }
            });
    }


    return <Button variant="positive" isFullWidth
                   onClick={() => openModal()}>Publish all</Button>

};

function createPayload(ids: Omit<IdsAPI, 'field'>): PublishEntryPayload {
    return {
        spaceId: ids.space,
        contentType: ids.contentType,
        entryId: ids.entry,
        organization: ids.organization,
        userId: ids.user,
        environment: ids.environment
    }
}

export default Sidebar;