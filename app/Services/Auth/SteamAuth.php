<?php

namespace App\Services\Auth;

use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\RequestOptions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Fluent;
use RuntimeException;

class SteamAuth implements SteamAuthInterface
{
    /**
     * @var string
     */
    public string $steamId;

    /**
     * @var SteamInfo
     */
    public SteamInfo $steamInfo;

    /**
     * @var string
     */
    public string $authUrl;

    /**
     * @var Request
     */
    private Request $request;

    /**
     * @var GuzzleClient
     */
    protected GuzzleClient $guzzleClient;

    /**
     * @var array
     */
    protected array $customRequestOptions = [];

    /**
     * @var string
     */
    const OPENID_URL = 'https://steamcommunity.com/openid/login';

    /**
     * @var string
     */
    const STEAM_INFO_URL = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=%s&steamids=%s';

    /**
     * @var string
     */
    const OPENID_SIG = 'openid_sig';

    /**
     * @var string
     */
    const OPENID_SIGNED = 'openid_signed';

    /**
     * @var string
     */
    const OPENID_ASSOC_HANDLE = 'openid_assoc_handle';

    /**
     * @var string
     */
    const OPENID_NS = 'http://specs.openid.net/auth/2.0';

    /**
     * Create a new SteamAuth instance.
     *
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        $this->request = $request;

        $redirect_url = Config::get('steam-auth.redirect_url');
        $this->authUrl = $this->buildUrl(
            url($redirect_url, [], Config::get('steam-auth.https'))
        );

        $this->guzzleClient = new GuzzleClient();
    }

    /**
     * Validates if the request object has required stream attributes.
     *
     * @return bool
     */
    private function requestIsValid(): bool
    {
        return $this->request->has(self::OPENID_ASSOC_HANDLE)
            && $this->request->has(self::OPENID_SIGNED)
            && $this->request->has(self::OPENID_SIG);
    }

    /**
     * Checks the steam login.
     *
     * @return bool
     * @throws GuzzleException
     */
    public function validate(): bool
    {
        if (!$this->requestIsValid()) {
            return false;
        }

        $requestOptions = $this->getDefaultRequestOptions();
        $customOptions = $this->getCustomRequestOptions();

        if (!empty($customOptions)) {
            $requestOptions = array_merge($requestOptions, $customOptions);
        }

        $response = $this->guzzleClient->request('POST', self::OPENID_URL, $requestOptions);

        $results = $this->parseResults($response->getBody()->getContents());

        $this->parseSteamID();
        $this->parseInfo();

        return $results->is_valid == true;
    }

    /**
     * Get param list for openId validation.
     *
     * @return array
     */
    public function getParams(): array
    {
        $params = [
            'openid.assoc_handle' => $this->request->get(self::OPENID_ASSOC_HANDLE),
            'openid.signed' => $this->request->get(self::OPENID_SIGNED),
            'openid.sig' => $this->request->get(self::OPENID_SIG),
            'openid.ns' => self::OPENID_NS,
            'openid.mode' => 'check_authentication',
        ];

        $signedParams = explode(',', $this->request->get(self::OPENID_SIGNED));

        foreach ($signedParams as $item) {
            $value = $this->request->get('openid_' . str_replace('.', '_', $item));
            $params['openid.' . $item] = $value;
        }

        return $params;
    }

    /**
     * Parse openID response to fluent object.
     *
     * @param string $results openid response body
     *
     * @return Fluent
     */
    public function parseResults(string $results): Fluent
    {
        $parsed = [];
        $lines = explode("\n", $results);

        foreach ($lines as $line) {
            if (empty($line)) {
                continue;
            }

            $line = explode(':', $line, 2);
            $parsed[$line[0]] = $line[1];
        }

        return new Fluent($parsed);
    }

    /**
     * Validates a given URL, ensuring it contains the http or https URI Scheme.
     *
     * @param string $url
     *
     * @return bool
     */
    private function validateUrl(string $url): bool
    {
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return false;
        }

        return true;
    }

    /**
     * Build the Steam login URL.
     *
     * @param string|null $return A custom return to URL
     *
     * @return string
     */
    private function buildUrl(string $return = null): string
    {
        if (is_null($return)) {
            $return = url('/', [], Config::get('steam-auth.https'));
        }
        if (!is_null($return) && !$this->validateUrl($return)) {
            throw new RuntimeException('The return URL must be a valid URL with a URI scheme or http or https.');
        }

        $realm = Config::get('steam-auth.realm', $this->request->server('HTTP_HOST'));
        $params = [
            'openid.ns' => self::OPENID_NS,
            'openid.mode' => 'checkid_setup',
            'openid.return_to' => $return,
            'openid.realm' => (Config::get('steam-auth.https') ? 'https' : 'http') . '://' . $realm,
            'openid.identity' => 'http://specs.openid.net/auth/2.0/identifier_select',
            'openid.claimed_id' => 'http://specs.openid.net/auth/2.0/identifier_select',
        ];

        return self::OPENID_URL . '?' . http_build_query($params, '', '&');
    }

    /**
     * Set the url to return to.
     *
     * @param string $url Full URL to redirect to on Steam login
     *
     * @return void
     */
    public function setRedirectUrl(string $url): void
    {
        $this->authUrl = $this->buildUrl($url);
    }

    /**
     * Returns the redirect response to login.
     *
     * @return RedirectResponse
     */
    public function redirect(): RedirectResponse
    {
        return redirect($this->getAuthUrl());
    }

    /**
     * Parse the steamID from the OpenID response.
     *
     * @return void
     */
    public function parseSteamID(): void
    {
        preg_match(
            '#^https?://steamcommunity.com/openid/id/([0-9]{17,25})#',
            $this->request->get('openid_claimed_id'),
            $matches
        );
        $this->steamId = is_numeric($matches[1]) ? $matches[1] : 0;
    }

    /**
     * Get user data from steam api.
     *
     * @return void
     * @throws GuzzleException
     */
    public function parseInfo(): void
    {

        if (empty(Config::get('steam-auth.api_key'))) {
            throw new RuntimeException('The Steam API key has not been specified.');
        }

        $response = $this->guzzleClient->request(
            'GET',
            sprintf(self::STEAM_INFO_URL, Config::get('steam-auth.api_key'), $this->steamId)
        );
        $json = json_decode($response->getBody(), true);

        $this->steamInfo = new SteamInfo($json['response']['players'][0]);
    }

    /**
     * Returns the login url.
     *
     * @return string|null
     */
    public function getAuthUrl(): ?string
    {
        return $this->authUrl;
    }

    /**
     * Returns the SteamUser info.
     *
     * @return SteamInfo
     */
    public function getUserInfo(): SteamInfo
    {

        return $this->steamInfo;
    }

    /**
     * Returns the steam id.
     *
     * @return string|null
     */
    public function getSteamId(): ?string
    {
        return $this->steamId;
    }

    /**
     * @return array
     */
    public function getDefaultRequestOptions(): array
    {
        return [
            RequestOptions::FORM_PARAMS => $this->getParams(),
        ];
    }

    /**
     * If you need to set additional guzzle options on request,
     * set them via this method.
     *
     * @param $options
     *
     * @return void
     */
    public function setCustomRequestOptions($options): void
    {
        $this->customRequestOptions = $options;
    }

    /**
     * @return array
     */
    public function getCustomRequestOptions(): array
    {
        return $this->customRequestOptions;
    }
}
