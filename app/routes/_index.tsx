import { ActionArgs, json, V2_MetaFunction } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { generateImage } from '~/handlers/openaiHandler';

export const meta: V2_MetaFunction = () => {
    return [{ title: 'Remix AI Image Generator' }];
};

export async function action({ request }: ActionArgs) {
    const formData = await request.formData();

    const description = formData.get('description');
    const size = formData.get('size') || 'medium';

    const errors = {
        description: description ? null : 'Description is required',
        size: size ? null : 'Size is required'
    };

    const hasErrors = Object.values(errors).some(
        (errorMessage) => errorMessage
    );

    if (hasErrors) {
        return json({
            error: errors,
            success: false,
            data: null
        });
    }

    invariant(typeof description === 'string', 'description must be a string');
    invariant(typeof size === 'string', 'size must be a string');

    const { error, data, success } = await generateImage(description, size);

    return json({ error, data, success });
}

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function Index() {
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();

    const isCreating = navigation.formData?.get('intent') === 'create';

    const { success, error, data } = actionData || {};

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
            <p className="mx-auto mt-6 max-w-lg text-center text-xl text-black sm:max-w-3xl">
                Open AI Image Generator 👋
            </p>
            <Form method="post">
                <p>
                    <label>
                        Image's description:
                        <input
                            type="text"
                            name="description"
                            className={inputClassName}
                            key={'description'}
                            defaultValue={''}
                        />
                    </label>
                </p>
                <button
                    type="submit"
                    name="intent"
                    value="create"
                    className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
                    disabled={isCreating}>
                    Create Image
                </button>
                {!isCreating && error && !success ? (
                    <div>{`generate image failed: ${error}`}</div>
                ) : null}

                {data?.imageUrl && success ? (
                    <img src={data?.imageUrl} />
                ) : null}

                {isCreating ? <div>image is creating...</div> : null}
            </Form>
        </div>
    );
}
